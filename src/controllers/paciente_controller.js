import Paciente from "../models/Paciente.js"
import Veterinario from "../models/Veterinario.js"
import mongoose from "mongoose"

const listarPacientes = async (req,res)=>{
    const pacientes = await Paciente.find({estado:true}).where('veterinario').equals(req.veterinarioBDD).select("-salida -createdAt -updatedAt -__v").populate('veterinario','_id nombre apellido')
    res.status(200).json(pacientes)
}

const detallePaciente = async(req,res)=>{
    const {id} = req.params
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Lo sentimos, no existe el veterinario ${id}`});
    const paciente = await Paciente.findById(id).select("-createdAt -updatedAt -__v").populate('veterinario','_id nombre apellido')
    res.status(200).json(paciente)
}

const registrarPaciente = async(req,res)=>{
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    // Verifica que el veterinario exista
    const veterinarioExistente = await Veterinario.findById(req.veterinarioBDD._id)
    if (!veterinarioExistente) return res.status(400).json({ msg: "El veterinario no existe" })
    const nuevoPaciente = new Paciente(req.body)
    nuevoPaciente.veterinario=req.body.id
    await nuevoPaciente.save()
    res.status(200).json({msg:"Registro exitoso del paciente"})
}

const actualizarPaciente = async(req,res)=>{
    const {id} = req.params
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Lo sentimos, no existe el veterinario ${id}`});
    await Paciente.findByIdAndUpdate(req.params.id,req.body)
    res.status(200).json({msg:"Actualización exitosa del paciente"})
}

const eliminarPaciente = async (req, res) => {
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ msg: `Lo sentimos, no existe el paciente con ID ${id}` });
        }
        // Utiliza findByIdAndDelete para eliminar el paciente por su ID
        const pacienteEliminado = await Paciente.findByIdAndDelete(id);
        if (!pacienteEliminado) {
            return res.status(404).json({ msg: `Lo sentimos, no existe el paciente con ID ${id}` });
        }
        res.status(204).json(); // Respuesta exitosa sin contenido (204 No Content)
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};

export {
    listarPacientes,
    detallePaciente,
    registrarPaciente,
    actualizarPaciente,
    eliminarPaciente
}