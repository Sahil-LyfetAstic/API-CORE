import { INestApplication } from '@nestjs/common';
import { Country } from 'src/modules/mongo/country/entities/country.entity';
import { User } from 'src/modules/mongo/user/entities/user.entity';
import { Role } from 'src/modules/mongo/user/role.enum';
import * as request from 'supertest';
import { setupApp } from '../../app.e2e-spec';
import { UserCred } from '../../test-credential';

describe('Country module as User', () => {
  let app: INestApplication;
  const body: Partial<Country> = {
    name: 'us_test',
    code: 'US',
  };
  let doc: Country;
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

  describe('autheticate as user', () => {
    it('/auth/local (login and get token)', () => {
      return request(app.getHttpServer())
        .post('/auth/local')
        .set('Accept', 'application/json')
        .send(UserCred)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body.data);
          expect(response.body.data.token);
          expect(response.body.data.token_expiry);
          expect(response.body.data.refresh_token);
          expect(response.body.data.user);
          expect(response.body.data.user.id);
          expect(response.body.data.user.role).toEqual(Role.User);
          expect(response.body.data.user.email).toEqual(UserCred.username);
          expect(response.body.data.user.password).toBeUndefined();
          auth = response.body.data;
        });
    });
  });

  describe('CRUD', () => {
    it('/country (Create)', () => {
      return request(app.getHttpServer())
        .post('/country')
        .set('Accept', 'application/json')
        .set({ Authorization: `Bearer ${auth.token}` })
        .send(body)
        .expect('Content-Type', /json/)
        .expect(201)
        .then((response) => {
          expect(response.body.data.country).toBeDefined();
          expect(typeof response.body.data.country.id).toBe('string');
          expect(response.body.data.country.name).toEqual(body.name);
          expect(response.body.data.country.deleted_at).toBeFalsy();
          doc = response.body.data.country;
        });
    });

    it('/country (getAll)', () => {
      return request(app.getHttpServer())
        .get('/country')
        .set({ Authorization: `Bearer ${auth.token}` })
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body.data.countries)).toBeTruthy();
          expect(typeof response.body.data.offset).toBe('number');
          expect(typeof response.body.data.limit).toBe('number');
          expect(typeof response.body.data.count).toBe('number');
        });
    });

    it('/country/:id (GetById)', () => {
      return request(app.getHttpServer())
        .get('/country/' + doc.id)
        .set({ Authorization: `Bearer ${auth.token}` })
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body.data.country).toBeDefined();
          expect(typeof response.body.data.country.id).toBe('string');
        });
    });

    it('/country/:id (Update)', () => {
      doc.name = 'us_test_edited';
      return request(app.getHttpServer())
        .put('/country/' + doc.id)
        .set('Accept', 'application/json')
        .set({ Authorization: `Bearer ${auth.token}` })
        .send(doc)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body.data.country).toBeDefined();
          expect(typeof response.body.data.country.id).toBe('string');
          expect(response.body.data.country.name).toEqual(doc.name);
        });
    });

    describe('/country (Create) - required properties missing', () => {
      const required = ['name', 'code'];
      for (let index = 0; index < required.length; index++) {
        const field = required[index];
        const badBody = { ...body, [field]: undefined };
        it(`[${field}]`, () => {
          return request(app.getHttpServer())
            .post('/country')
            .set('Accept', 'application/json')
            .set({ Authorization: `Bearer ${auth.token}` })
            .send(badBody)
            .expect('Content-Type', /json/)
            .expect(400);
        });
      }
    });

    describe('/country (Create) - invalid properties', () => {
      const bad = {
        name: 123,
        code: 123,
      };
      for (const prop in bad) {
        const badBody = { ...body, [prop]: bad[prop] };
        it(`[${prop}]`, () => {
          return request(app.getHttpServer())
            .post('/country')
            .set('Accept', 'application/json')
            .set({ Authorization: `Bearer ${auth.token}` })
            .send(badBody)
            .expect('Content-Type', /json/)
            .expect(400);
        });
      }
    });

    describe('/country (Update) - invalid properties', () => {
      const bad = {
        name: 123,
        code: 123,
      };
      for (const prop in bad) {
        const badBody = { ...body, [prop]: bad[prop] };
        it(`[${prop}]`, () => {
          return request(app.getHttpServer())
            .put('/country/' + doc.id)
            .set('Accept', 'application/json')
            .set({ Authorization: `Bearer ${auth.token}` })
            .send(badBody)
            .expect('Content-Type', /json/)
            .expect(400);
        });
      }
    });

    it('/country/:id (Delete)', () => {
      return request(app.getHttpServer())
        .delete('/country/' + doc.id)
        .set({ Authorization: `Bearer ${auth.token}` })
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body.data.country).toBeDefined();
          expect(typeof response.body.data.country.id).toBe('string');
          expect(response.body.data.country.deleted_at).toBeTruthy();
        });
    });

    it('/country/:id (GetById deleted record)', () => {
      return request(app.getHttpServer())
        .get('/country/' + doc.id)
        .set({ Authorization: `Bearer ${auth.token}` })
        .expect('Content-Type', /json/)
        .expect(404);
    });

    it('/country/:id (Hard Delete)', () => {
      return request(app.getHttpServer())
        .delete('/country/' + doc.id + '?mode=hard')
        .set({ Authorization: `Bearer ${auth.token}` })
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body.data.country);
          expect(response.body.data.country.id);
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
