"use client";

import { createLink } from "@/app/actions/create-link";
import { verifyLink } from "@/app/actions/verify-link";
import Button from "@/app/components/ui/button";
import TextInput from "@/app/components/ui/text-input";
import { sanitizeLink } from "@/app/lib/utils";
import { useRouter } from "next/navigation";

import { ChangeEvent, FormEvent, useState } from "react";

export default function CreateLinkForm() {
  const router = useRouter();

  const [link, setLink] = useState("");
  const [error, setError] = useState("");

  function handleLinkChange(e: ChangeEvent<HTMLInputElement>) {
    setLink(sanitizeLink(e.target.value));
    setError("");
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    //quando o usuario nao escreve o link
    if (link.length === 0) return setError("Escolha um link primeiro :)");

    //quando o usuario escolhe um link já existente
    const isLinkTaken = await verifyLink(link);

    if (isLinkTaken) return setError("desculpe, esse link já está em uso");

    //Criar perfil
    const isLinkCreated = await createLink(link);

    if (!isLinkCreated)
      return setError("Erro ao criar perfil. Tente novamente.");

    router.push(`/${link}`);
  }
  return (
    <>
      <form onSubmit={handleSubmit} className="w-full flex items-center gap-2">
        <span>projectinbio.com/</span>
        <TextInput value={link} onChange={handleLinkChange} />
        <Button className="w-[126px]">Criar</Button>
      </form>
      <div>
        <span className="text-accent-pink">{error}</span>
      </div>
    </>
  );
}
