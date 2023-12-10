import { INestApplication } from '@nestjs/common';
import { Country } from 'src/modules/mongo/country/entities/country.entity';
import { State } from 'src/modules/mongo/state/entities/state.entity';
import { User } from 'src/modules/mongo/user/entities/user.entity';
import { Role } from 'src/modules/mongo/user/role.enum';
import * as request from 'supertest';
import { setupApp } from '../../app.e2e-spec';
import { AdminCred } from '../../test-credential';

describe('State module as Admin', () => {
  let app: INestApplication;
  const body: Partial<State> = {
    name: 'us_state_test',
    code: 'US',
  };
  const countryBody: Partial<Country> = {
    name: 'us_test',
    code: 'US',
  };
  let doc: State;
  let countryDoc: Country;
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
    it('/country (Create) to use in state', () => {
      return request(app.getHttpServer())
        .post('/country')
        .set('Accept', 'application/json')
        .set({ Authorization: `Bearer ${auth.token}` })
        .send(countryBody)
        .expect('Content-Type', /json/)
        .expect(201)
        .then((response) => {
          expect(response.body.data.country).toBeDefined();
          expect(typeof response.body.data.country.id).toBe('string');
          expect(response.body.data.country.name).toEqual(countryBody.name);
          expect(response.body.data.country.deleted_at).toBeFalsy();
          countryDoc = response.body.data.country;
        });
    });

    it('/state (Create)', () => {
      return request(app.getHttpServer())
        .post('/state')
        .set('Accept', 'application/json')
        .set({ Authorization: `Bearer ${auth.token}` })
        .send({
          ...body,
          country_id: countryDoc.id,
        })
        .expect('Content-Type', /json/)
        .expect(201)
        .then((response) => {
          expect(response.body.data.state).toBeDefined();
          expect(typeof response.body.data.state.id).toBe('string');
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
          expect(typeof response.body.data.state.id).toBe('string');
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
          expect(typeof response.body.data.state.id).toBe('string');
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
          expect(typeof response.body.data.state.id).toBe('string');
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

    it('/country/:id (Delete)', () => {
      return request(app.getHttpServer())
        .delete('/country/' + countryDoc.id)
        .set({ Authorization: `Bearer ${auth.token}` })
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body.data.country).toBeDefined();
          expect(typeof response.body.data.country.id).toBe('string');
          expect(response.body.data.country.deleted_at).toBeTruthy();
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
