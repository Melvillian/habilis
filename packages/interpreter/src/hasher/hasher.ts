import { TaskSpec } from "@habilis/core";

export interface Hasher {
  hash(spec: TaskSpec): string;
}
