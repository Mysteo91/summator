import {CommandATI} from "./ati";
import {NL} from "../command";

test('commandATI_EXPECTED_OK_test', () => {
  
  const response = `ATI${NL}` +
    `SIMCOM_Ltd${NL}` +
    `SIMCOM_SIM900D${NL}` +
    `Revision:1137B03SIM900D64_ST_ENHANCE${NL}` +
    `OK`
  
  const result = CommandATI.parser(response)
  
  expect(result.isOk).toBe(true)
  expect(result.vendor).toBe("SIMCOM_Ltd")
  expect(result.model).toBe("SIMCOM_SIM900D")
  expect(result.revision).toBe("1137B03SIM900D64_ST_ENHANCE")
});

test('commandATI_EXPECTED_NOT_OK_test', () => {
  
  const response = `ATI${NL}` +
    `SIMCOM_SIM900D${NL}` +
    `Revision:1137B03SIM900D64_ST_ENHANCE${NL}` +
    `OK`
  
  const result = CommandATI.parser(response);
  
  expect(result.isOk).toBe(false)
});
