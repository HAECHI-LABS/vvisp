// https://github.com/ethereum/web3.js/issues/1023

const Promisify = inner =>
  new Promise((resolve, reject) =>
    inner((err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    })
  );

export default async function(filter) {
  return await Promisify(cb => filter.get(cb));
}
