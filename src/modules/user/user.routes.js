import express from "express";
import userController from "./user.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestion des utilisateurs
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Récupérer tous les utilisateurs
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Liste des utilisateurs récupérée avec succès.
 */
router.get(
    "/",
    userController.getUsers
);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Récupérer un utilisateur par son ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID MongoDB de l'utilisateur
 *     responses:
 *       200:
 *         description: Utilisateur trouvé
 *       404:
 *         description: Utilisateur introuvable
 */
router.get(
    "/:id",
    userController.getUser
);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Modifier un utilisateur
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Utilisateur modifié avec succès
 *       404:
 *         description: Utilisateur introuvable
 */
router.put(
    "/:id",
    userController.updateUser
);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Supprimer un utilisateur
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Utilisateur supprimé avec succès
 *       404:
 *         description: Utilisateur introuvable
 */
router.delete(
    "/:id",
    userController.deleteUser
);

export default router;