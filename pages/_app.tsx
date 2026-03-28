import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"keywords":"敏感、爱思考","struggle":"总担心别人不喜欢我","question":"怎么不在意别人看法"}'
  
