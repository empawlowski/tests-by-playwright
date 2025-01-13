import { mergeTests } from "@playwright/test";
import { builders } from "./builders.fixture";

export const test = mergeTests(builders);

export { expect } from "@playwright/test";
