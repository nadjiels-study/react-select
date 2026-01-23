
export default function delay<T>(promise: Promise<T>, time: number, after = false) {
  return new Promise<T>(async (resolve, reject) => {
    let response: T, error: any;

    promise = promise
      .then(res => response = res)
      .catch(err => error = err);

    if(after) await promise;

    setTimeout(async () => {
      await promise;

      if (error !== undefined) reject(error);
      else resolve(response);
    }, time)
  })
}
