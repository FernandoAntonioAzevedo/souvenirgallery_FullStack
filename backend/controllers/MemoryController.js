const Memory = require("../models/Memory");

const fs = require("fs");

const removeOldImage = (memory) => {
    fs.unlink(memory.src, (error) => {
        if(error) {
            console.log(error);
        } else {
            console.log("Imagem excluida do servidor!");
        }
    });
};

// Criando nova Recordação
const createMemory = async (req, res) => {
    try {       
        const {title, description} = req.body;
        const src = `images/${req.file.filename}`;

        console.log(req.file);

        if(!title || !description) {
            return res
            .status(400)
            .json({msg: "Por favor, preencha todos os campos."});
        }

        const newMemory = new Memory({
            title, 
            src, 
            description,
        });

        await newMemory.save();
        res.json({msg: "Memória criada com sucesso!", newMemory});
    } catch (error) {
       console.log(error.message);
       res.status(500).send("Ocorreu um erro!"); 
    }
};

// Obtendo todas as recordações
const getMemories = async(req, res) => {
  try {
    const memories = await Memory.find();
     res.json(memories);        
  } catch (error) {
     res.status(500).send({ msg: "Por favor, tente novamente"});
  }
};

// Obter única individualmente por ID
const getMemory = async(req, res) => {
  try {    
    const Memory = await Memory.findById(req.params.id);
    if(!memory) {
        return res.status(404).json({msg: "Memória não encontrada!"});
    }

    res.json(memory);    
  } catch (error) {
    res.status(500).send({msg: "Ocorreu um erro"});  
    
  }
};

// Atualização de Recordação por ID
const updateMemory = async (req, res) => {
  try {
    const { title, description } = req.body;

    let src = null;

    if (req.file) {
      src = `images/${req.file.filename}`;
    }

    const memory = await Memory.findById(req.params.id);

    if (!memory) {
      return res.status(404).json({ msg: "Memória não encontrada!" });
    }

    if (src) {
      removeOldImage(memory);
    }

    const updateData = {};

    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (src) updateData.src = src;

    const updateMemory = await Memory.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updateMemory);
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Por favor, tente novamente" });
  }
};

// Deletando recordação por ID
const deleteMemory = async (req, res) => {
    try {
       const memory = await Memory.findByIdAndRemove(req.params.id);

       if(!memory) {
        return res.status(404).json({msg: "Memória não encontrada!"});    
       }

       removeOldImage(memory);


       res.json({msg: "Memória excluida!"});        
    } catch (error) {
      console.log(error);
      res.status(500).send({msg: "Ocorreu um erro, tente novamente"});    
    }
};

// adicionando ou removendo recordação de favoritos
const toggleFavorite = async (req, res) => {
  try {
    const memory = await Memory.findById(req.params.id);

    if (!memory) {
      return res.status(404).json({ msg: "Memória não encontrada!" });
    }

    memory.favorite = !memory.favorite;

    memory.save();

    res.json({ msg: "Adicionada aos favoritos", memory });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Por favor, tente novamente" });
  }
};

// adicionando comentário a recordações
const addComment = async (req, res) => {
  try {
    console.log(req);
    const { name, text } = req.body;

    if (!name || !text) {
      return res
        .status(400)
        .json({ msg: "Por favor, preencha todos os campos." });
    }

    const comment = {
      name,
      text,
    };

    const memory = await Memory.findById(req.params.id);

    if (!memory) {
      return res.status(404).json({ msg: "Memória não encontrada!" });
    }

    memory.comments.push(comment);

    console.log(memory);

    memory.save();

    res.json({ msg: "Comentário adicionado!", memory });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Por favor, tente novamente" });
  }
};

module.exports = {
    createMemory,
    getMemories,
    getMemory,
    getMemoryById,
    updateMemory,
    deleteMemory,
    toggleFavorite,
    addComment,
};