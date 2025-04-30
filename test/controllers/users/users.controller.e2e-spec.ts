import { faker } from '@faker-js/faker/.';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/shared/infrastructure/services/prisma/prisma.service';
import request from 'supertest';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();

    prisma = await app.get(PrismaService);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  describe('POST /users', () => {
    it('SHOULD create a new user and return 201 Created', async () => {
      // Arrange
      const userDto = {
        name: faker.person.firstName(),
        email: faker.internet.email(),
      };

      // Act
      const response = await request(app.getHttpServer())
        .post('/v1/users')
        .send(userDto)
        .expect(201);

      // Assert
      const createdUser = response.body;

      expect(createdUser).toHaveProperty('id');
      expect(createdUser).toHaveProperty('name', userDto.name);
      expect(createdUser).toHaveProperty('email', userDto.email);
      expect(createdUser).toHaveProperty('createdAt');
      expect(createdUser).toHaveProperty('updatedAt');
    });
  });

  describe('GET /v1/users', () => {
    it('SHOULD return an empty array initially', async () => {
      // Act & Assert
      const response = await request(app.getHttpServer())
        .get('/v1/users')
        .expect(200);

      expect(response.body).toEqual([]);
    });

    it('SHOULD return a list of users after creation', async () => {
      // Arrange
      const userDto = {
        name: faker.person.firstName(),
        email: faker.internet.email(),
      };

      await request(app.getHttpServer())
        .post('/v1/users')
        .send(userDto)
        .expect(201);

      // Act
      const response = await request(app.getHttpServer())
        .get('/v1/users')
        .expect(200);

      // Assert
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toMatchObject({
        name: userDto.name,
        email: userDto.email,
      });
    });
  });

  describe('GET /v1/users/:id', () => {
    it('SHOULD return 200 and the user when it exists', async () => {
      // Arrange
      const userDto = {
        name: faker.person.firstName(),
        email: faker.internet.email(),
      };

      const postResponse = await request(app.getHttpServer())
        .post('/v1/users')
        .send(userDto)
        .expect(201);

      const userId = postResponse.body.id;

      // Act
      const response = await request(app.getHttpServer())
        .get(`/v1/users/${userId}`)
        .expect(200);

      // Assert
      expect(response.body).toHaveProperty('id', userId);
      expect(response.body).toMatchObject({
        name: userDto.name,
        email: userDto.email,
      });
    });

    it('SHOULD return 404 when the user does not exist', async () => {
      // Arrange
      const nonExistentId = faker.string.uuid();

      // Act & Assert
      const response = await request(app.getHttpServer())
        .get(`/v1/users/${nonExistentId}`)
        .expect(404);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe(
        `User with id ${nonExistentId} not found`,
      );
    });
  });

  describe('PUT /v1/users/:id', () => {
    it('SHOULD update the user and return the updated data', async () => {
      // Arrange
      const originalUser = {
        name: faker.person.firstName(),
        email: faker.internet.email(),
      };

      const postResponse = await request(app.getHttpServer())
        .post('/v1/users')
        .send(originalUser)
        .expect(201);

      const userId = postResponse.body.id;

      // Arrange
      const updatedUser = {
        name: faker.person.firstName(),
        email: faker.internet.email(),
      };

      // Act
      const response = await request(app.getHttpServer())
        .put(`/v1/users/${userId}`)
        .send(updatedUser)
        .expect(200);

      // Assert
      expect(response.body).toHaveProperty('id', userId);
      expect(response.body).toMatchObject({
        name: updatedUser.name,
        email: updatedUser.email,
      });
      expect(response.body.updatedAt).not.toEqual(postResponse.body.updatedAt);
    });
  });

  describe('DELETE /v1/users/:id', () => {
    it('SHOULD delete the user and return 204 No Content', async () => {
      // Arrange
      const userDto = {
        name: faker.person.firstName(),
        email: faker.internet.email(),
      };

      const postResponse = await request(app.getHttpServer())
        .post('/v1/users')
        .send(userDto)
        .expect(201);

      const userId = postResponse.body.id;

      // Act & Assert
      await request(app.getHttpServer())
        .delete(`/v1/users/${userId}`)
        .expect(204);
    });

    it('SHOULD return 404 on subsequent GET after deletion', async () => {
      // Arrange
      const userDto = {
        name: faker.person.firstName(),
        email: faker.internet.email(),
      };

      const postResponse = await request(app.getHttpServer())
        .post('/v1/users')
        .send(userDto)
        .expect(201);

      const userId = postResponse.body.id;

      await request(app.getHttpServer())
        .delete(`/v1/users/${userId}`)
        .expect(204);

      // Act & Assert
      const response = await request(app.getHttpServer())
        .get(`/v1/users/${userId}`)
        .expect(404);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe(`User with id ${userId} not found`);
    });

    it('SHOULD return 404 when trying to delete a non-existent user', async () => {
      // Arrange
      const fakeId = faker.string.uuid();

      // Act & Assert
      const response = await request(app.getHttpServer())
        .delete(`/v1/users/${fakeId}`)
        .expect(404);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe(`User with id ${fakeId} not found`);
    });
  });
});
