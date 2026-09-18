import serverModule from '../dist/vercel-api.cjs';

export default function handler(req, res) {
  return serverModule.default ? serverModule.default(req, res) : serverModule(req, res);
}