import database from "infra/database.js";

async function status(request, response) {
  const result = await database.query('SELECT 1 + 1 as SUM;');
  console.log(result.rows)
  const { method } = request;

  if (method === 'GET') {
    response.status(200).json({ status: 'ok' });
  } else {
    response.setHeader('Allow', ['GET']);
    response.status(405).end(`Method ${method} Not Allowed`);
  }
}
export default status;

// This API route handles GET requests to check the status of the server.
// If the request method is not GET, it responds with a 405 Method Not Allowed status.
// The response also includes an Allow header indicating that only GET requests are allowed.
