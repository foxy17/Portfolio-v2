export default async function callServerSideAPI(url: RequestInfo) {
  return await fetch(url).then((res) => res.json());
}
