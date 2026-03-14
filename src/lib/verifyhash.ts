import crypto from "crypto";
import bcrypt from "bcrypt";

export async function verifyHashPassword(password: string, hash: string) {
  // 1. Verifica se é um hash bcrypt
  if (hash.startsWith("$2")) {
    const compara = await bcrypt.compare(password, hash);
    return compara;
  }
  

  // 2. Caso antigo: MD5
  const md5Hash = crypto.createHash("md5").update(password).digest("hex");
  if (md5Hash === hash) {
    // Se o usuário logar com sucesso, atualize a senha pra bcrypt:
    const novoHash = await bcrypt.hash(password, 10);
    // ... atualize no banco
    return true;
  }

  if (password === hash) {
    return true;
  }

  return false;
}