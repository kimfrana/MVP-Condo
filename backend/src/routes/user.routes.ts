import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";

const router = Router();

router.get("/get-mock", async (req: Request, res: Response) => {
  try {
    const usuario = await prisma.usuario.findFirst();

    res.json({
      success: true,
      data: {
        usuario: { id: usuario?.id },
      },
    });
  } catch (error) {
    console.error("Erro ao consultar usuário:", error);
    res.status(500).json({
      success: false,
      error: "Erro ao consultar usuário:",
    });
  }
});

router.post("/get-by-email", async (req: Request, res: Response) => {
  try {
    const usuario = await prisma.usuario.findFirst({
      where: { email: req.body.email },
    });

    console.log(usuario);
    if (!usuario){
      res.status(404).json({
        success: false,
        error: "Usuário não encontrado",
      });
      return;
    }

    res.json({
      success: true,
      data: {
        usuario: { id: usuario.id , nome: usuario.nome, email: usuario.email },
      },
    });
  } catch (error) {
    console.error("Erro ao consultar usuário:", error);
    res.status(500).json({
      success: false,
      error: "Erro ao consultar usuário:",
    });
  }
});

export default router;
