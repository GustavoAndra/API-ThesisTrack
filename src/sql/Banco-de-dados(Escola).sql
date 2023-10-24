-- MySQL Script generated by MySQL Workbench
-- Tue Oct 24 08:44:39 2023
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
  `idpessoa` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(50) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`idpessoa`),
  UNIQUE INDEX `idpessoa_UNIQUE` (`idpessoa` ASC) VISIBLE,
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `infocimol`.`usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `infocimol`.`usuario` (
  `senha` VARCHAR(50) NOT NULL,
  `pessoa_idpessoa` INT UNSIGNED NOT NULL,
  INDEX `fk_usuario_pessoa_idx` (`pessoa_idpessoa` ASC) VISIBLE,
  CONSTRAINT `fk_usuario_pessoa`
    FOREIGN KEY (`pessoa_idpessoa`)
    REFERENCES `infocimol`.`pessoa` (`idpessoa`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `infocimol`.`administrador`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `infocimol`.`administrador` (
  `pessoa_idpessoa` INT UNSIGNED NOT NULL,
  INDEX `fk_administrador_pessoa1_idx` (`pessoa_idpessoa` ASC) VISIBLE,
  CONSTRAINT `fk_administrador_pessoa1`
    FOREIGN KEY (`pessoa_idpessoa`)
    REFERENCES `infocimol`.`pessoa` (`idpessoa`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `infocimol`.`professor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `infocimol`.`professor` (
  `pessoa_idpessoa` INT UNSIGNED NOT NULL,
  INDEX `fk_professor_pessoa1_idx` (`pessoa_idpessoa` ASC) VISIBLE,
  PRIMARY KEY (`pessoa_idpessoa`),
  CONSTRAINT `fk_professor_pessoa1`
    FOREIGN KEY (`pessoa_idpessoa`)
    REFERENCES `infocimol`.`pessoa` (`idpessoa`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `infocimol`.`projeto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `infocimol`.`projeto` (
  `idprojeto` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `titulo` VARCHAR(50) NOT NULL,
  `problema` VARCHAR(200) NOT NULL,
  `resumo` VARCHAR(300) NOT NULL,
  `tema` VARCHAR(45) NOT NULL,
  `delimitacao` VARCHAR(45) NOT NULL,
  `abstract` VARCHAR(300) NOT NULL,
  PRIMARY KEY (`idprojeto`),
  UNIQUE INDEX `idprojeto_UNIQUE` (`idprojeto` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `infocimol`.`orientacao`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `infocimol`.`orientacao` (
  `professor_pessoa_idpessoa` INT UNSIGNED NOT NULL,
  `projeto_idprojeto` INT UNSIGNED NOT NULL,
  INDEX `fk_orientacao_professor1_idx` (`professor_pessoa_idpessoa` ASC) VISIBLE,
  INDEX `fk_orientacao_projeto1_idx` (`projeto_idprojeto` ASC) VISIBLE,
  CONSTRAINT `fk_orientacao_professor1`
    FOREIGN KEY (`professor_pessoa_idpessoa`)
    REFERENCES `infocimol`.`professor` (`pessoa_idpessoa`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_orientacao_projeto1`
    FOREIGN KEY (`projeto_idprojeto`)
    REFERENCES `infocimol`.`projeto` (`idprojeto`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `infocimol`.`aluno`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `infocimol`.`aluno` (
  `pessoa_idpessoa` INT UNSIGNED NOT NULL,
  `matricula` INT NOT NULL,
  INDEX `fk_table1_pessoa1_idx` (`pessoa_idpessoa` ASC) VISIBLE,
  PRIMARY KEY (`pessoa_idpessoa`),
  CONSTRAINT `fk_table1_pessoa1`
    FOREIGN KEY (`pessoa_idpessoa`)
    REFERENCES `infocimol`.`pessoa` (`idpessoa`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `infocimol`.`aluno_projeto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `infocimol`.`aluno_projeto` (
  `projeto_idprojeto` INT UNSIGNED NOT NULL,
  `aluno_pessoa_idpessoa` INT UNSIGNED NOT NULL,
  INDEX `fk_aluno_curso_projeto1_idx` (`projeto_idprojeto` ASC) VISIBLE,
  INDEX `fk_aluno_curso_aluno1_idx` (`aluno_pessoa_idpessoa` ASC) VISIBLE,
  CONSTRAINT `fk_aluno_curso_projeto1`
    FOREIGN KEY (`projeto_idprojeto`)
    REFERENCES `infocimol`.`projeto` (`idprojeto`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_aluno_curso_aluno1`
    FOREIGN KEY (`aluno_pessoa_idpessoa`)
    REFERENCES `infocimol`.`aluno` (`pessoa_idpessoa`)
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
  `professor_pessoa_idpessoa` INT UNSIGNED NOT NULL,
  `curso_id_curso` INT UNSIGNED NOT NULL,
  INDEX `fk_coordenacao_professor1_idx` (`professor_pessoa_idpessoa` ASC) VISIBLE,
  INDEX `fk_coordenacao_curso1_idx` (`curso_id_curso` ASC) VISIBLE,
  CONSTRAINT `fk_coordenacao_professor1`
    FOREIGN KEY (`professor_pessoa_idpessoa`)
    REFERENCES `infocimol`.`professor` (`pessoa_idpessoa`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_coordenacao_curso1`
    FOREIGN KEY (`curso_id_curso`)
    REFERENCES `infocimol`.`curso` (`id_curso`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `infocimol`.`aluno_curso`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `infocimol`.`aluno_curso` (
  `curso_id_curso` INT UNSIGNED NOT NULL,
  `aluno_pessoa_idpessoa` INT UNSIGNED NOT NULL,
  INDEX `fk_aluno_curso_curso1_idx` (`curso_id_curso` ASC) VISIBLE,
  INDEX `fk_aluno_curso_aluno2_idx` (`aluno_pessoa_idpessoa` ASC) VISIBLE,
  CONSTRAINT `fk_aluno_curso_curso1`
    FOREIGN KEY (`curso_id_curso`)
    REFERENCES `infocimol`.`curso` (`id_curso`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_aluno_curso_aluno2`
    FOREIGN KEY (`aluno_pessoa_idpessoa`)
    REFERENCES `infocimol`.`aluno` (`pessoa_idpessoa`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;