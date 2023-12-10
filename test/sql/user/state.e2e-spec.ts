import { INestApplication } from '@nestjs/common';
import { State } from 'src/modules/sql/state/entities/state.entity';
import { User } from 'src/modules/sql/user/entities/user.entity';
import { Role } from 'src/modules/sql/user/role.enum';
import * as request from 'supertest';
import { setupApp } from '../../app.e2e-spec';
import { UserCred } from '../../test-credential';

describe('State module as User', () => {
  let app: INestApplication;
  const body: Partial<State> = {
    country_id: 1,
    name: 'us_test',
    code: 'US',
  };
  let doc: State;
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
    it('/state (Create)', () => {
      return request(app.getHttpServer())
        .post('/state')
        .set('Accept', 'application/json')
        .set({ Authorization: `Bearer ${auth.token}` })
        .send(body)
        .expect('Content-Type', /json/)
        .expect(201)
        .then((response) => {
          expect(response.body.data.state).toBeDefined();
          expect(typeof response.body.data.state.id).toBe('number');
          expect(response.body.data.state.name).toEqual(body.name);
          expect(response.body.data.state.deleted_at).toBeFalsy();
          doc = response.body.data.state;
        });
    });

    it('/state (getAll)', () => {
      return request(app.getHttpServer())
        .get('/state')
        .set({ Authorization: `Bearer ${auth.token}` })
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body.data.states)).toBeTruthy();
          expect(typeof response.body.data.offset).toBe('number');
          expect(typeof response.body.data.limit).toBe('number');
          expect(typeof response.body.data.count).toBe('number');
        });
    });

    it('/state/:id (GetById)', () => {
      return request(app.getHttpServer())
        .get('/state/' + doc.id)
        .set({ Authorization: `Bearer ${auth.token}` })
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body.data.state).toBeDefined();
          expect(typeof response.body.data.state.id).toBe('number');
        });
    });

    it('/state/:id (Update)', () => {
      doc.name = 'us_test_edited';
      return request(app.getHttpServer())
        .put('/state/' + doc.id)
        .set('Accept', 'application/json')
        .set({ Authorization: `Bearer ${auth.token}` })
        .send(doc)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body.data.state).toBeDefined();
          expect(typeof response.body.data.state.id).toBe('number');
          expect(response.body.data.state.name).toEqual(doc.name);
        });
    });

    describe('/state (Create) - required properties missing', () => {
      const required = ['country_id', 'name', 'code'];
      for (let index = 0; index < required.length; index++) {
        const field = required[index];
        const badBody = { ...body, [field]: undefined };
        it(`[${field}]`, () => {
          return request(app.getHttpServer())
            .post('/state')
            .set('Accept', 'application/json')
            .set({ Authorization: `Bearer ${auth.token}` })
            .send(badBody)
            .expect('Content-Type', /json/)
            .expect(400);
        });
      }
    });

    describe('/state (Create) - invalid properties', () => {
      const bad = {
        country_id: 'US',
        name: 123,
        code: 123,
      };
      for (const prop in bad) {
        const badBody = { ...body, [prop]: bad[prop] };
        it(`[${prop}]`, () => {
          return request(app.getHttpServer())
            .post('/state')
            .set('Accept', 'application/json')
            .set({ Authorization: `Bearer ${auth.token}` })
            .send(badBody)
            .expect('Content-Type', /json/)
            .expect(400);
        });
      }
    });

    describe('/state (Update) - invalid properties', () => {
      const bad = {
        country_id: 'US',
        name: 123,
        code: 123,
      };
      for (const prop in bad) {
        const badBody = { ...body, [prop]: bad[prop] };
        it(`[${prop}]`, () => {
          return request(app.getHttpServer())
            .put('/state/' + doc.id)
            .set('Accept', 'application/json')
            .set({ Authorization: `Bearer ${auth.token}` })
            .send(badBody)
            .expect('Content-Type', /json/)
            .expect(400);
        });
      }
    });

    it('/state/:id (Delete)', () => {
      return request(app.getHttpServer())
        .delete('/state/' + doc.id)
        .set({ Authorization: `Bearer ${auth.token}` })
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body.data.state).toBeDefined();
          expect(typeof response.body.data.state.id).toBe('number');
          expect(response.body.data.state.deleted_at).toBeTruthy();
        });
    });

    it('/state/:id (GetById deleted record)', () => {
      return request(app.getHttpServer())
        .get('/state/' + doc.id)
        .set({ Authorization: `Bearer ${auth.token}` })
        .expect('Content-Type', /json/)
        .expect(404);
    });

    it('/state/:id (Hard Delete)', () => {
      return request(app.getHttpServer())
        .delete('/state/' + doc.id + '?mode=hard')
        .set({ Authorization: `Bearer ${auth.token}` })
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body.data.state);
          expect(response.body.data.state.id);
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
