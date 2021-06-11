import {NL} from "../command";
import {CommandAT} from "./at";

test('commandAT_EXPECTED_OK_test', () => {
  
  expect(CommandAT.parser(`AT${NL}` +
    `OK`).isOk)
    .toBe(true);
});

test('commandAT_EXPECTED_NOT_OK_test', () => {
  
  expect(CommandAT.parser(`ATSSS`).isOk)
    .toBe(false);
});
