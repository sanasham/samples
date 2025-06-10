Feature: Delete Swap by Swap Code
  As an API user
  I want to delete a swap by its Swap Code
  So that I can remove unwanted swap records

  Scenario: Successfully delete an existing swap
    Given I have a valid swap code "SW123"
    When I send a DELETE request to "/api/swaps/SW123"
    Then the response status should be 200
    And the response should confirm deletion

  Scenario: Attempt to delete a non-existent swap
    Given I have an invalid swap code "SW999"
    When I send a DELETE request to "/api/swaps/SW999"
    Then the response status should be 404
    And the response should indicate "No item found"

  Scenario: Attempt to delete without providing swap code
    Given I don't provide a swap code
    When I send a DELETE request to "/api/swaps/"
    Then the response status should be 404




import { expect, request } from '@playwright/test';
import { Given, When, Then } from '@cucumber/cucumber';
import { apiUrl } from '../config';

let response: any;
let swapCode: string;

Given('I have a valid swap code {string}', async function (code: string) {
  swapCode = code;
  // You might want to first create the item to ensure it exists
  const apiContext = await request.newContext();
  const createResponse = await apiContext.post(`${apiUrl}/swaps`, {
    data: {
      SwapCd: code,
      Branch: 'NY001',
      Channel: 'Online',
      Term: 12,
      StartDt: '2023-01-01',
      EndDt: '2023-12-31'
    }
  });
  expect(createResponse.ok()).toBeTruthy();
});

Given('I have an invalid swap code {string}', function (code: string) {
  swapCode = code;
});

Given('I don\'t provide a swap code', function () {
  swapCode = '';
});

When('I send a DELETE request to {string}', async function (endpoint: string) {
  const apiContext = await request.newContext();
  const url = swapCode ? `${apiUrl}${endpoint.replace('SW999', swapCode)}` : `${apiUrl}${endpoint}`;
  response = await apiContext.delete(url);
});

Then('the response status should be {int}', async function (status: number) {
  expect(response.status()).toBe(status);
});

Then('the response should confirm deletion', async function () {
  const responseBody = await response.json();
  expect(responseBody.message).toMatch(/successfully deleted|deletion successful/i);
  expect(responseBody.deletedSwap.SwapCd).toBe(swapCode);
  
  // Verify the item is actually deleted by trying to fetch it
  const apiContext = await request.newContext();
  const getResponse = await apiContext.get(`${apiUrl}/swaps/${swapCode}`);
  expect(getResponse.status()).toBe(404);
});

Then('the response should indicate {string}', async function (message: string) {
  const responseBody = await response.json();
  expect(responseBody.message).toContain(message);
});
