import '@testing-library/jest-dom';
import 'whatwg-fetch';
import { server } from './__mocks__/node';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
