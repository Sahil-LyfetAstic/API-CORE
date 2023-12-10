import { INestApplication } from '@nestjs/common';
import { User } from 'src/modules/sql/user/entities/user.entity';
import { Role } from 'src/modules/sql/user/role.enum';
import * as request from 'supertest';
import { setupApp } from '../../app.e2e-spec';
import { AdminCred } from '../../test-credential';

describe('User module as Admin', () => {
  let app: INestApplication;
  const body: Partial<User> = {
    role: Role.User,
    first_name: 'Test',
    last_name: 'User',
    email: 'test@user.com',
    phone_code: '+1',
    phone: '9999999999',
    password: '123456',
    active: true,
  };
  let doc: User;
  let auth: {
    token: string;
    token_expiry: string;
    refresh_token: string;
    user: User;
  };

  beforeAll(async () => {
    app = await setupApp();
    await app.init();
  });

  describe('autheticate as admin', () => {
    it('/auth/local (login and get token)', () => {
      return request(app.getHttpServer())
        .post('/auth/local')
        .set('Accept', 'application/json')
        .send(AdminCred)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body.data);
          expect(response.body.data.token);
          expect(response.body.data.token_expiry);
          expect(response.body.data.refresh_token);
          expect(response.body.data.user);
          expect(response.body.data.user.id);
          expect(response.body.data.user.role).toEqual(Role.Admin);
          expect(response.body.data.user.email).toEqual(AdminCred.username);
          expect(response.body.data.user.password).toBeUndefined();
          auth = response.body.data;
        });
    });
  });

  describe('CRUD', () => {
    it('/user/me (UserMe)', () => {
      return request(app.getHttpServer())
        .get('/user/me')
        .set({ Authorization: `Bearer ${auth.token}` })
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body.data.user).toBeDefined();
          expect(typeof response.body.data.user.id).toBe('number');
          expect(response.body.data.user.role).toEqual(auth.user.role);
          expect(response.body.data.user.email).toEqual(auth.user.email);
          expect(response.body.data.user.password).toBeUndefined();
        });
    });

    it('/user (Create)', () => {
      return request(app.getHttpServer())
        .post('/user')
        .set('Accept', 'application/json')
        .set({ Authorization: `Bearer ${auth.token}` })
        .send(body)
        .expect('Content-Type', /json/)
        .expect(201)
        .then((response) => {
          expect(response.body.data.user).toBeDefined();
          expect(typeof response.body.data.user.id).toBe('number');
          expect(response.body.data.user.role).toEqual(body.role);
          expect(response.body.data.user.first_name).toEqual(body.first_name);
          expect(response.body.data.user.password).toBeUndefined();
          expect(response.body.data.user.deleted_at).toBeFalsy();
          doc = response.body.data.user;
        });
    });

    it('/user (getAll)', () => {
      return request(app.getHttpServer())
        .get('/user')
        .set({ Authorization: `Bearer ${auth.token}` })
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body.data.users)).toBeTruthy();
          expect(typeof response.body.data.offset).toBe('number');
          expect(typeof response.body.data.limit).toBe('number');
          expect(typeof response.body.data.count).toBe('number');
        });
    });

    /* it('/user (Create duplicate email)', () => {
      return request(app.getHttpServer())
        .post('/user')
        .set('Accept', 'application/json')
        .set({ Authorization: `Bearer ${auth.token}` })
        .send(user)
        .expect('Content-Type', /json/)
        .expect(400);
    }); */

    it('/user/:id (GetById)', () => {
      return request(app.getHttpServer())
        .get('/user/' + doc.id)
        .set({ Authorization: `Bearer ${auth.token}` })
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body.data.user).toBeDefined();
          expect(typeof response.body.data.user.id).toBe('number');
          expect(response.body.data.user.password).toBeUndefined();
        });
    });

    it('/user/:id (Update)', () => {
      doc.first_name = 'User1';
      return request(app.getHttpServer())
        .put('/user/' + doc.id)
        .set('Accept', 'application/json')
        .set({ Authorization: `Bearer ${auth.token}` })
        .send(doc)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body.data.user).toBeDefined();
          expect(typeof response.body.data.user.id).toBe('number');
          expect(response.body.data.user.password).toBeUndefined();
        });
    });

    describe('/user (Create) - required properties missing', () => {
      const required = [
        'first_name',
        'last_name',
        'email',
        'phone_code',
        'phone',
        'password',
      ];
      for (let index = 0; index < required.length; index++) {
        const field = required[index];
        const badUser = { ...body, [field]: undefined };
        it(`[${field}]`, () => {
          return request(app.getHttpServer())
            .post('/user')
            .set('Accept', 'application/json')
            .set({ Authorization: `Bearer ${auth.token}` })
            .send(badUser)
            .expect('Content-Type', /json/)
            .expect(400);
        });
      }
    });

    describe('/user (Create) - invalid properties', () => {
      const bad = {
        first_name: 123,
        last_name: 123,
        email: '123',
        phone_code: false,
        phone: 999,
        password: '45',
      };
      for (const prop in bad) {
        const badUser = { ...body, [prop]: bad[prop] };
        it(`[${prop}]`, () => {
          return request(app.getHttpServer())
            .post('/user')
            .set('Accept', 'application/json')
            .set({ Authorization: `Bearer ${auth.token}` })
            .send(badUser)
            .expect('Content-Type', /json/)
            .expect(400);
        });
      }
    });

    describe('/user (Update) - invalid properties', () => {
      const bad = {
        first_name: 123,
        last_name: 123,
        email: 123,
        phone_code: 11,
        phone: false,
      };
      for (const prop in bad) {
        const badUser = { ...body, [prop]: bad[prop] };
        it(`[${prop}]`, () => {
          return request(app.getHttpServer())
            .put('/user/' + doc.id)
            .set('Accept', 'application/json')
            .set({ Authorization: `Bearer ${auth.token}` })
            .send(badUser)
            .expect('Content-Type', /json/)
            .expect(400);
        });
      }
    });

    it('/user/:id (Delete)', () => {
      return request(app.getHttpServer())
        .delete('/user/' + doc.id)
        .set({ Authorization: `Bearer ${auth.token}` })
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body.data.user).toBeDefined();
          expect(typeof response.body.data.user.id).toBe('number');
          expect(response.body.data.user.password).toBeUndefined();
          expect(response.body.data.user.deleted_at).toBeTruthy();
        });
    });

    it('/user/:id (GetById deleted record)', () => {
      return request(app.getHttpServer())
        .get('/user/' + doc.id)
        .set({ Authorization: `Bearer ${auth.token}` })
        .expect('Content-Type', /json/)
        .expect(404);
    });

    it('/user/:id (Hard Delete)', () => {
      return request(app.getHttpServer())
        .delete('/user/' + doc.id + '?mode=hard')
        .set({ Authorization: `Bearer ${auth.token}` })
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body.data.user);
          expect(response.body.data.user.id);
          expect(response.body.data.user.password).toBeUndefined();
        });
    });
  });

  describe('logout', () => {
    it('/auth/logout (logout)', () => {
      return request(app.getHttpServer())
        .post('/auth/logout')
        .set('Accept', 'application/json')
        .set({ Authorization: `Bearer ${auth.token}` })
        .send({})
        .expect('Content-Type', /json/)
        .expect(200);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
