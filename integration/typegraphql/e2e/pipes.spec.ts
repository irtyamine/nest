import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { ApplicationModule } from '../src/app.module';

describe('GraphQL Pipes', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [ApplicationModule],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it(`should throw an error`, () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        operationName: null,
        variables: {},
        query:
          'mutation {\n  addRecipe(newRecipeData: {title: "test", ingredients: []}) {\n    id\n  }\n}\n',
      })
      .expect(200, {
        data: null,
        errors: [
          {
            extensions: {
              code: 'INTERNAL_SERVER_ERROR',
              exception: {
                message: {
                  error: 'Bad Request',
                  message: [
                    {
                      children: [],
                      constraints: {
                        length:
                          'description must be longer than or equal to 30 characters',
                      },
                      property: 'description',
                      target: {
                        ingredients: [],
                        title: 'test',
                      },
                    },
                  ],
                  statusCode: 400,
                },
                response: {
                  error: 'Bad Request',
                  message: [
                    {
                      children: [],
                      constraints: {
                        length:
                          'description must be longer than or equal to 30 characters',
                      },
                      property: 'description',
                      target: {
                        ingredients: [],
                        title: 'test',
                      },
                    },
                  ],
                  statusCode: 400,
                },
                status: 400,
              },
            },
            locations: [
              {
                column: 3,
                line: 2,
              },
            ],
            message: {
              error: 'Bad Request',
              message: [
                {
                  children: [],
                  constraints: {
                    length:
                      'description must be longer than or equal to 30 characters',
                  },
                  property: 'description',
                  target: {
                    ingredients: [],
                    title: 'test',
                  },
                },
              ],
              statusCode: 400,
            },
            path: ['addRecipe'],
          },
        ],
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
