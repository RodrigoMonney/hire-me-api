import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  let prismaService: PrismaService;

  beforeEach(() => {
    prismaService = new PrismaService();
  });

  afterEach(async () => {
    await prismaService.$disconnect();
  });

  it('SHOULD connect to the database on module init', async () => {
    const connectSpy = jest
      .spyOn(prismaService, '$connect')
      .mockResolvedValue();

    await prismaService.onModuleInit();

    expect(connectSpy).toHaveBeenCalled();
  });

  it('SHOULD disconnect from the database on module destroy', async () => {
    const disconnectSpy = jest
      .spyOn(prismaService, '$disconnect')
      .mockResolvedValue();

    await prismaService.onModuleDestroy();

    expect(disconnectSpy).toHaveBeenCalled();
  });
});
