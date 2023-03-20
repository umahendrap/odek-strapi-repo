/**
 *
 * Tests for InputIUD
 *
 */

import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { ThemeProvider, lightTheme } from '@strapi/design-system';
import { IntlProvider } from 'react-intl';
import InputUID from '../index';

jest.mock('@strapi/helper-plugin', () => ({
  ...jest.requireActual('@strapi/helper-plugin'),
  useCMEditViewDataManager: jest.fn(() => ({
    modifiedData: {},
    initialData: {},
  })),
}));

describe('Content-Manager | <InputUID />', () => {
  const props = {
    attribute: {
      required: false,
    },
    contentTypeUID: 'api::test.test',
    intlLabel: {
      id: 'test',
      defaultMessage: 'test',
    },
    name: 'test',
    onChange: jest.fn(),
    value: 'michka',
  };

  it('renders', async () => {
    const { getByText } = render(
      <ThemeProvider theme={lightTheme}>
        <IntlProvider locale="en" messages={{}}>
          <InputUID {...props} />
        </IntlProvider>
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(getByText('test')).toBeInTheDocument();
    });
  });
});
