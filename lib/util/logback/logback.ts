import type { Function } from "@/lib/util/types";

export default function logback<F extends Function>(
  callback: F,
  message?: string
) {
  return (...params: Parameters<F>) => {
    let log = callback.name;

    if(message) log += `: ${message}`;

    console.log(log);

    return callback(...params);
  };
}
