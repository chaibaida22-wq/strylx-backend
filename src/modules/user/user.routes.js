import express from "express";

import userController from "./user.controller.js";


const router = express.Router();


// =================================
// SWAGGER
// =================================

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestion des utilisateurs
 */


// =================================
// GET ALL USERS
// =================================

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Récupérer tous les utilisateurs actifs
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Liste des utilisateurs récupérée avec succès.
 */

router.get(
    "/",
    userController.getUsers
);


// =================================
// GET ARCHIVED USERS
// =================================

/**
 * @swagger
 * /api/users/archived:
 *   get:
 *     summary: Récupérer les utilisateurs archivés
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Liste des utilisateurs archivés.
 */

router.get(
    "/archived",
    userController.getArchivedUsers
);


// =================================
// RESTORE USER
// =================================

/**
 * @swagger
 * /api/users/{id}/restore:
 *   patch:
 *     summary: Réactiver un utilisateur archivé
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Utilisateur réactivé avec succès.
 *       404:
 *         description: Utilisateur introuvable.
 */

router.patch(
    "/:id/restore",
    userController.restoreUser
);


// =================================
// GET USER BY ID
// =================================

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
 *     responses:
 *       200:
 *         description: Utilisateur trouvé.
 *       404:
 *         description: Utilisateur introuvable.
 */

router.get(
    "/:id",
    userController.getUser
);


// =================================
// UPDATE USER
// =================================

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
 *     responses:
 *       200:
 *         description: Utilisateur modifié avec succès.
 *       404:
 *         description: Utilisateur introuvable.
 */

router.put(
    "/:id",
    userController.updateUser
);


// =================================
// ARCHIVE USER
// =================================

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Archiver un utilisateur
 *     description: L'utilisateur n'est pas supprimé définitivement. Son compte est archivé.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Utilisateur archivé avec succès.
 *       404:
 *         description: Utilisateur introuvable.
 */

router.delete(
    "/:id",
    userController.deleteUser
);


export default router;