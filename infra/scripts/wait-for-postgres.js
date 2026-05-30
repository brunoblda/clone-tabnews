const { exec } = require("node:child_process");

function checkPostgres() {
  exec("docker exec postgres-dev pg_isready --host localhost", handleReturn);

  function handleReturn(error, stdout) {
    if (stdout.search("accepting connections") === -1) {
      console.log("🔴 Postgres ainda não está aceitando conexões.");
      setTimeout(checkPostgres, 1000);
      return;
    }

    console.log("🟢 Postgres está pronto e aceitando conexões.");
  }
}

console.log("🟡 Aguardando o Postgres aceitar conexões...");
checkPostgres();
