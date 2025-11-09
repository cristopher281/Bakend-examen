-- Script para configurar la base de datos de la biblioteca
-- Ejecuta este script en MySQL para crear las tablas necesarias

-- Crear la base de datos (si no existe)
CREATE DATABASE IF NOT EXISTS biblioteca;
USE biblioteca;

-- Crear tabla de autores
CREATE TABLE IF NOT EXISTS autores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de libros
CREATE TABLE IF NOT EXISTS libros (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    autor_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (autor_id) REFERENCES autores(id)
    ON DELETE SET NULL
);

-- Insertar algunos autores de ejemplo
INSERT INTO autores (nombre) VALUES
('Gabriel García Márquez'),
('Mario Vargas Llosa'),
('Isabel Allende'),
('Jorge Luis Borges'),
('Pablo Neruda');

-- Insertar algunos libros de ejemplo
INSERT INTO libros (titulo, autor_id) VALUES
('Cien años de soledad', 1),
('El amor en los tiempos del cólera', 1),
('La ciudad y los perros', 2),
('La casa de los espíritus', 3),
('Ficciones', 4),
('Veinte poemas de amor', 5);