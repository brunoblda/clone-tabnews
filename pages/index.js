import { SpeedInsights } from "@vercel/speed-insights/next";

function Home() {
  return (
    teste(),
    <div>
      <h1>Projeto Updated</h1>
      <SpeedInsights />
    </div>
  );
}

function teste() {
  console.log("teste");
}

export default Home;
