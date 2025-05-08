import { faker } from '@faker-js/faker';
import { mock } from 'jest-mock-extended';
import { Role } from 'src/modules/auth/domain/enums/role.enum';
import { CacheService } from 'src/shared/infrastructure/services/cache/cache.service';
import { UserEntity } from '../domain/user.entity';
import { UserRepository } from '../domain/user.repository';
import { CreateUserDto } from '../web/dto/create-user.dto';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let sut: UsersService;
  const userRepository = mock<UserRepository>();
  const cacheService = mock<CacheService>();

  beforeEach(() => {
    sut = new UsersService(userRepository, cacheService);
  });

  describe('createUser', () => {
    it('SHOULD create a user and clear cache', async () => {
      // Arrange
      const userToCreate: CreateUserDto = {
        name: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      const createdUser: UserEntity = {
        id: faker.string.uuid(),
        name: faker.person.firstName(),
        email: faker.internet.email(),
        password: 'pass123',
        role: Role.USER,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
      };

      userRepository.create.mockResolvedValue(createdUser);
      cacheService.del.mockResolvedValue(undefined);

      // Act
      const result = await sut.createUser(userToCreate);

      // Assert
      expect(result).toEqual(createdUser);
      expect(userRepository.create).toHaveBeenCalledWith(userToCreate);
      expect(cacheService.del).toHaveBeenCalledWith('users:all');
    });
  });

  describe('findAllUsers', () => {
    it('SHOULD return users from cache if present', async () => {
      // Arrange
      const users = [
        {
          id: faker.string.uuid(),
          name: faker.person.firstName(),
          email: faker.internet.email(),
        },
      ] as UserEntity[];

      cacheService.get.mockResolvedValue(users);

      // Act
      const result = await sut.findAllUsers();

      // Assert
      expect(result).toEqual(users);
      expect(cacheService.get).toHaveBeenCalledWith('users:all');
      expect(userRepository.findAll).not.toHaveBeenCalled();
    });

    it('SHOULD fetch users from repository and cache the result when cache is empty', async () => {
      // Arrange
      const users = [
        {
          id: faker.string.uuid(),
          name: faker.person.firstName(),
          email: faker.internet.email(),
        },
      ] as UserEntity[];

      cacheService.get.mockResolvedValue(null);
      userRepository.findAll.mockResolvedValue(users);

      cacheService.set.mockResolvedValue(undefined);

      // Act
      const result = await sut.findAllUsers();

      // Assert
      expect(cacheService.get).toHaveBeenCalledWith('users:all');
      expect(userRepository.findAll).toHaveBeenCalled();
      expect(cacheService.set).toHaveBeenCalledWith('users:all', users);
      expect(result).toEqual(users);
    });
  });

  describe('findUserById', () => {
    it('SHOULD return user from cache if present', async () => {
      // Arrange
      const id = faker.string.uuid();
      const user = {
        id,
        name: faker.person.firstName(),
        email: faker.internet.email(),
      } as UserEntity;

      cacheService.get.mockResolvedValue(user);

      // Act
      const result = await sut.findUserById(id);

      // Assert
      expect(cacheService.get).toHaveBeenCalledWith(`users:${id}`);
      expect(userRepository.findById).not.toHaveBeenCalled();
      expect(result).toEqual(user);
    });

    it('SHOULD return user from repository and cache it when not in cache', async () => {
      // Arrange
      const id = faker.string.uuid();
      const user = {
        id,
        name: faker.person.firstName(),
        email: faker.internet.email(),
      } as UserEntity;

      cacheService.get.mockResolvedValue(null);
      userRepository.findById.mockResolvedValue(user);
      cacheService.set.mockResolvedValue(undefined);

      // Act
      const result = await sut.findUserById(id);

      // Assert
      expect(cacheService.get).toHaveBeenCalledWith(`users:${id}`);
      expect(userRepository.findById).toHaveBeenCalledWith(id);
      expect(cacheService.set).toHaveBeenCalledWith(`users:${id}`, user);
      expect(result).toEqual(user);
    });

    it('SHOULD throw NotFoundException when user is not found in repository', async () => {
      // Arrange
      const id = faker.string.uuid();
      cacheService.get.mockResolvedValue(null);
      userRepository.findById.mockResolvedValue(null);
      cacheService.set.mockResolvedValue(undefined);

      // Act & Assert
      const result = await sut.findUserById(id);

      // Assert
      expect(cacheService.get).toHaveBeenCalledWith(`users:${id}`);
      expect(userRepository.findById).toHaveBeenCalledWith(id);
      expect(cacheService.set).not.toHaveBeenCalledWith(`users:${id}`, null);
      expect(result).toBeNull();
    });
  });

  describe('updateUser', () => {
    it('SHOULD update user and clear related cache', async () => {
      // Arrange
      const id = faker.string.uuid();
      const user = {
        id,
        name: faker.person.firstName(),
        email: faker.internet.email(),
      } as UserEntity;

      const updateData = {
        name: faker.person.firstName(),
        email: faker.internet.email(),
      };

      userRepository.update.mockResolvedValue(user);
      cacheService.del.mockResolvedValue(undefined);

      // Act
      const result = await sut.updateUser(id, updateData);

      // Assert
      expect(result).toEqual(user);
      expect(userRepository.update).toHaveBeenCalledWith(id, updateData);
      expect(cacheService.del).toHaveBeenCalledWith('users:all');
      expect(cacheService.del).toHaveBeenCalledWith(`users:${id}`);
    });
  });

  describe('deleteUser', () => {
    it('SHOULD delete user and clear related cache', async () => {
      // Arrange
      const id = faker.string.uuid();

      const user = {
        id,
        name: faker.person.firstName(),
        email: faker.internet.email(),
      } as UserEntity;

      userRepository.findById.mockResolvedValue(user);
      userRepository.delete.mockResolvedValue(undefined);
      cacheService.del.mockResolvedValue(undefined);

      // Act
      await sut.deleteUser(id);

      // Assert
      expect(userRepository.delete).toHaveBeenCalledWith(id);

      expect(cacheService.del).toHaveBeenCalledWith('users:all');
      expect(cacheService.del).toHaveBeenCalledWith(`users:${id}`);
    });
  });
});
