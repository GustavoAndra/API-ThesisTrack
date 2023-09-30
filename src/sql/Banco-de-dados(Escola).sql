-- MySQL Script generated by MySQL Workbench
-- Thu Aug 24 10:23:35 2023
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema infocimol
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema infocimol
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `infocimol` DEFAULT CHARACTER SET utf8 ;
USE `infocimol` ;

-- -----------------------------------------------------
-- Table `infocimol`.`pessoa`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `infocimol`.`pessoa` (
  `id_pessoa` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(50) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id_pessoa`),
  UNIQUE INDEX `id_pessoa_UNIQUE` (`id_pessoa` ASC) VISIBLE)
ENGINE = InnoDB;
-- -----------------------------------------------------
-- Table `infocimol`.`usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `infocimol`.`usuario` (
  `pessoa_id_pessoa` INT UNSIGNED NOT NULL,
  `senha` VARCHAR(50) NOT NULL,
  `perfil` VARCHAR(45) NOT NULL,
  INDEX `fk_usuario_pessoa_idx` (`pessoa_id_pessoa` ASC) VISIBLE,
  CONSTRAINT `fk_usuario_pessoa`
    FOREIGN KEY (`pessoa_id_pessoa`)
    REFERENCES `infocimol`.`pessoa` (`id_pessoa`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `infocimol`.`administrador`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `infocimol`.`administrador` (
  `pessoa_id_pessoa` INT UNSIGNED NOT NULL,
  CONSTRAINT `fk_administrador_pessoa1`
    FOREIGN KEY (`pessoa_id_pessoa`)
    REFERENCES `infocimol`.`pessoa` (`id_pessoa`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `infocimol`.`projeto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `infocimol`.`projeto` (
  `id_projeto` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `titulo` VARCHAR(50) NOT NULL,
  `resumo` TEXT(300) NOT NULL,
  `abstract` TEXT(300) NULL,
  `problema` TEXT(250) NOT NULL,
  `tema` VARCHAR(45) NOT NULL,
  `delimitacao` VARCHAR(45) NOT NULL,
  `arquivo` BLOB NULL,
  PRIMARY KEY (`id_projeto`),
  UNIQUE INDEX `id_projeto_UNIQUE` (`id_projeto` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `infocimol`.`aluno`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `infocimol`.`aluno` (
  `pessoa_id_pessoa` INT UNSIGNED NOT NULL,
  `matricula` INT NOT NULL,
  CONSTRAINT `fk_aluno_pessoa1`
    FOREIGN KEY (`pessoa_id_pessoa`)
    REFERENCES `infocimol`.`pessoa` (`id_pessoa`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `infocimol`.`professor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `infocimol`.`professor` (
  `pessoa_id_pessoa` INT UNSIGNED NOT NULL,
  CONSTRAINT `fk_professor_pessoa1`
    FOREIGN KEY (`pessoa_id_pessoa`)
    REFERENCES `infocimol`.`pessoa` (`id_pessoa`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `infocimol`.`orientacao`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `infocimol`.`orientacao` (
  `projeto_id_projeto` INT UNSIGNED NOT NULL,
  `professor_pessoa_id_pessoa` INT UNSIGNED NOT NULL,
  INDEX `fk_projeto_has_professor_professor1_idx` (`professor_pessoa_id_pessoa` ASC) VISIBLE,
  INDEX `fk_projeto_has_professor_projeto1_idx` (`projeto_id_projeto` ASC) VISIBLE,
  CONSTRAINT `fk_projeto_has_professor_projeto1`
    FOREIGN KEY (`projeto_id_projeto`)
    REFERENCES `infocimol`.`projeto` (`id_projeto`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_projeto_has_professor_professor1`
    FOREIGN KEY (`professor_pessoa_id_pessoa`)
    REFERENCES `infocimol`.`professor` (`pessoa_id_pessoa`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `infocimol`.`curso`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `infocimol`.`curso` (
  `id_curso` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `curso` VARCHAR(45) NOT NULL,
  `logo` VARCHAR(45) NOT NULL,
  `numero` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_curso`),
  UNIQUE INDEX `id_curso_UNIQUE` (`id_curso` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `infocimol`.`coordenacao`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `infocimol`.`coordenacao` (
  `curso_id_curso` INT UNSIGNED NOT NULL,
  `professor_pessoa_id_pessoa` INT UNSIGNED NOT NULL,
  INDEX `fk_curso_has_professor_professor1_idx` (`professor_pessoa_id_pessoa` ASC) VISIBLE,
  INDEX `fk_curso_has_professor_curso1_idx` (`curso_id_curso` ASC) VISIBLE,
  CONSTRAINT `fk_curso_has_professor_curso1`
    FOREIGN KEY (`curso_id_curso`)
    REFERENCES `infocimol`.`curso` (`id_curso`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_curso_has_professor_professor1`
    FOREIGN KEY (`professor_pessoa_id_pessoa`)
    REFERENCES `infocimol`.`professor` (`pessoa_id_pessoa`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `infocimol`.`aluno_curso`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `infocimol`.`aluno_curso` (
  `curso_id_curso` INT UNSIGNED NOT NULL,
  `aluno_pessoa_id_pessoa` INT UNSIGNED NOT NULL,
  INDEX `fk_curso_has_aluno_aluno1_idx` (`aluno_pessoa_id_pessoa` ASC) VISIBLE,
  INDEX `fk_curso_has_aluno_curso1_idx` (`curso_id_curso` ASC) VISIBLE,
  CONSTRAINT `fk_curso_has_aluno_curso1`
    FOREIGN KEY (`curso_id_curso`)
    REFERENCES `infocimol`.`curso` (`id_curso`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_curso_has_aluno_aluno1`
    FOREIGN KEY (`aluno_pessoa_id_pessoa`)
    REFERENCES `infocimol`.`aluno` (`pessoa_id_pessoa`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `infocimol`.`aluno_projeto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `infocimol`.`aluno_projeto` (
  `aluno_pessoa_id_pessoa` INT UNSIGNED NOT NULL,
  `projeto_id_projeto` INT UNSIGNED NOT NULL,
  INDEX `fk_aluno_has_projeto_projeto1_idx` (`projeto_id_projeto` ASC) VISIBLE,
  INDEX `fk_aluno_has_projeto_aluno1_idx` (`aluno_pessoa_id_pessoa` ASC) VISIBLE,
  CONSTRAINT `fk_aluno_has_projeto_aluno1`
    FOREIGN KEY (`aluno_pessoa_id_pessoa`)
    REFERENCES `infocimol`.`aluno` (`pessoa_id_pessoa`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_aluno_has_projeto_projeto1`
    FOREIGN KEY (`projeto_id_projeto`)
    REFERENCES `infocimol`.`projeto` (`id_projeto`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;