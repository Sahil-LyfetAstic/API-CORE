import { INestApplication } from '@nestjs/common';
import { Page } from 'src/modules/sql/page/entities/page.entity';
import { User } from 'src/modules/sql/user/entities/user.entity';
import { Role } from 'src/modules/sql/user/role.enum';
import * as request from 'supertest';
import { setupApp } from '../../app.e2e-spec';
import { AdminCred } from '../../test-credential';

describe('Page module as Admin', () => {
  let app: INestApplication;
  const body: Partial<Page> = {
    name: 'page_test',
    title: 'Test Page',
    content: 'Page content',
    allow_html: true,
  };
  let doc: Page;
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
    it('/page (Create)', () => {
      return request(app.getHttpServer())
        .post('/page')
        .set('Accept', 'application/json')
        .set({ Authorization: `Bearer ${auth.token}` })
        .send(body)
        .expect('Content-Type', /json/)
        .expect(201)
        .then((response) => {
          expect(response.body.data.page).toBeDefined();
          expect(typeof response.body.data.page.id).toBe('number');
          expect(response.body.data.page.name).toEqual(body.name);
          expect(response.body.data.page.deleted_at).toBeFalsy();
          doc = response.body.data.page;
        });
    });

    it('/page (getAll)', () => {
      return request(app.getHttpServer())
        .get('/page')
        .set({ Authorization: `Bearer ${auth.token}` })
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body.data.pages)).toBeTruthy();
          expect(typeof response.body.data.offset).toBe('number');
          expect(typeof response.body.data.limit).toBe('number');
          expect(typeof response.body.data.count).toBe('number');
        });
    });

    it('/page/:id (GetById)', () => {
      return request(app.getHttpServer())
        .get('/page/' + doc.id)
        .set({ Authorization: `Bearer ${auth.token}` })
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body.data.page).toBeDefined();
          expect(typeof response.body.data.page.id).toBe('number');
        });
    });

    it('/page/:id (Update)', () => {
      doc.name = 'page_test_edited';
      return request(app.getHttpServer())
        .put('/page/' + doc.id)
        .set('Accept', 'application/json')
        .set({ Authorization: `Bearer ${auth.token}` })
        .send(doc)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body.data.page).toBeDefined();
          expect(typeof response.body.data.page.id).toBe('number');
          expect(response.body.data.page.name).toEqual(body.name);
        });
    });

    describe('/page (Create) - required properties missing', () => {
      const required = ['name', 'title', 'content', 'allow_html'];
      for (let index = 0; index < required.length; index++) {
        const field = required[index];
        const badBody = { ...body, [field]: undefined };
        it(`[${field}]`, () => {
          return request(app.getHttpServer())
            .post('/page')
            .set('Accept', 'application/json')
            .set({ Authorization: `Bearer ${auth.token}` })
            .send(badBody)
            .expect('Content-Type', /json/)
            .expect(400);
        });
      }
    });

    describe('/page (Create) - invalid properties', () => {
      const bad = {
        name: 123,
        title: 123,
        content: 123,
        allow_html: 'invalid',
      };
      for (const prop in bad) {
        const badBody = { ...body, [prop]: bad[prop] };
        it(`[${prop}]`, () => {
          return request(app.getHttpServer())
            .post('/page')
            .set('Accept', 'application/json')
            .set({ Authorization: `Bearer ${auth.token}` })
            .send(badBody)
            .expect('Content-Type', /json/)
            .expect(400);
        });
      }
    });

    describe('/page (Update) - invalid properties', () => {
      const bad = {
        title: 123,
        content: 123,
      };
      for (const prop in bad) {
        const badBody = { ...body, [prop]: bad[prop] };
        it(`[${prop}]`, () => {
          return request(app.getHttpServer())
            .put('/page/' + doc.id)
            .set('Accept', 'application/json')
            .set({ Authorization: `Bearer ${auth.token}` })
            .send(badBody)
            .expect('Content-Type', /json/)
            .expect(400);
        });
      }
    });

    it('/page/:id (Delete)', () => {
      return request(app.getHttpServer())
        .delete('/page/' + doc.id)
        .set({ Authorization: `Bearer ${auth.token}` })
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body.data.page).toBeDefined();
          expect(typeof response.body.data.page.id).toBe('number');
          expect(response.body.data.page.deleted_at).toBeTruthy();
        });
    });

    it('/page/:id (GetById deleted record)', () => {
      return request(app.getHttpServer())
        .get('/page/' + doc.id)
        .set({ Authorization: `Bearer ${auth.token}` })
        .expect('Content-Type', /json/)
        .expect(404);
    });

    it('/page/:id (Hard Delete)', () => {
      return request(app.getHttpServer())
        .delete('/page/' + doc.id + '?mode=hard')
        .set({ Authorization: `Bearer ${auth.token}` })
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body.data.page);
          expect(response.body.data.page.id);
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
