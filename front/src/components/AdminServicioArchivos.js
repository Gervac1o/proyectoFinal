import React from 'react';
import { Redirect,Link } from 'react-router-dom';
import axios from 'axios';
import BorrarDoc from './BorrarDoc';
import ActualizarComentario from './ActualizarComentario';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

class AdminServicioArchivos extends React.Component {


    
    estadoRef = React.createRef();
    comentarioRef=React.createRef();

    state = {
        idAlumno: this.props.id,
        statusArchivo: null,
        file: null,
        status: null,
        lista: {},
        listar:[],
        comentar: "",
        usuario: {},
        servicio: {
            idServicio: "null"
        },
        alumno: {},
        statusServicio: false,
        cambioEstado: {
            estado:"NUEVO",

        },
        statusEstado: null,
    };

    changeState = () =>{

     if(this.estadoRef === "undefined"){  
        this.setState({
            cambioEstado:{
                idAlumno:this.props.id,
                idServicio: this.state.servicio.idServicio,
                semestre: this.state.servicio.semestre,
                responsableDirecto: this.state.servicio.responsableDirecto,
                estado: this.state.servicio.estado,
                fechaRegistro: this.state.servicio.fechaRegistro,
                revisado:this.state.servicio.revisado
            },
            statusServicio:true,
        })  
    }
    else{
        this.setState({
            cambioEstado:{
                idAlumno:this.props.id,
                idServicio: this.state.servicio.idServicio,
                semestre: this.state.servicio.semestre,
                responsableDirecto: this.state.servicio.responsableDirecto,
                estado: this.estadoRef.current.value,
                fechaRegistro: this.state.servicio.fechaRegistro,
                revisado:cookies.get('nombre'),
            },
            statusServicio:true,
        })  
    }
    }//Fin de ChangeState

    componentWillMount=()=> {
        this.getLista();
        this.getServicio();  
    }

    getServicio = () => {
       
        axios.get("servicioSocial/findIdAlumno/"+ this.props.id)
        .then(response => {
        this.setState({
            servicio: response.data,
            cambioEstado: response.data,
            
        });
        
    });   

    }//Fin de getservicio()
    getAlumno = () => {
        axios.get("/alumno/find/" + this.state.idAlumno)
            .then(response => {
                this.setState({
                    alumno: response.data,
                });
            });
    }//Fin de getAlumno()
    
    deleteServicio = () => {
        axios.delete("servicioSocial/delete/"+this.props.id)
        .then(res => {
            window.location.href = "./" + this.props.id
        })
    }//Fin de deleteServicio
    
    cancelComentario = () => {
        this.setState({
            comentario: {
                status: "false",
                texto: ""
            },
            statusComentario: "true"
        })
    }
    cambiarEstado = () => {
       
        if(this.state.statusServicio === true){
            this.changeState();
            axios.patch("servicioSocial/update", this.state.cambioEstado)
                 .then(res => {
                     this.getServicio();
                 }); 
                 window.location.reload(true);
        }
        else{
            console.log("el cambio estado esta en undefined")
        }
    
           
            
    }//Fin de Cambiar Estado

    fileChange = (event) => {
        this.setState({
             file: event.target.files[0]
         });
     }

    getLista = () => {
        axios.get( "lista/findServicio/" + this.props.id)
            .then(response => {
                this.setState({
                    listar: response.data,
                });
            });
    }
    guardarLista = async (e) => {
        await axios.post("lista/save", this.state.lista)
        .then(res => {
            this.setState({
                status: "true"
            });
        });
    }
    fileChange = (event) => {
        this.setState({
             file: event.target.files[0]
         });
     }
    upLoad = () => {
        if(this.state.file && this.state.file != null && this.state.file != undefined){
            const fd = new FormData();
            fd.append('file', this.state.file, this.state.file.name)
                axios.post("docServicio/upload/" + this.state.file.name + this.props.id, fd)
                    .then(res =>{
                        this.setState({
                            lista:{
                                idAlumno: this.props.id,
                                nombreDoc: res.data,
                                idTramite: 4,
                                idDoc: res.data + this.props.id,
                                comentario: this.state.comentar
                            },
                            statusArchivo: "true"
                        })
                        this.guardarLista();
                        window.location.reload(false);
                    });
        }else{
            this.setState({
                statusArchivo: "false"
            });
        }//Fin de else file
    }//Fin de funcion upLoad
    render() {
            return (
                <div className="center">
                            <div id="sidebar" className="archivosAdminCenter">
                            <br />
                            <strong>SERVICIO SOCIAL</strong>
                            <div>
                            <br/>
                          
                                          
                                <input type="checkbox" id="btn-modal" />
                                <label htmlFor="btn-modal" className="btn" onClick={this.getEmail}>INFORMACIÓN DE LA SOLICITUD</label>
                                 <div className="modal">
                                <div className="contenedor">
                                    <h1>Servicio Social</h1>
                                    <label htmlFor="btn-modal">X</label>
                                    <div className="contenido">
                                <div>
                                <strong>Fecha de Registro:</strong> {this.state.servicio.fechaRegistro}
                                </div>
                                <div>
                                <strong>Semestre:</strong> {this.state.servicio.semestre}
                                </div>
                                <div>
                                <strong>Correo electónico:</strong> {this.state.usuario.email}
                                </div>        
                                <div>
                                    <strong>Revisado por: </strong> {this.state.servicio.revisado}
                                </div>
                                <div>
                                {(() => {  
                                    switch (this.state.cambioEstado.estado){
                                        case "NUEVO":
                                            return (
                                                <a id="state_new">NUEVO</a>
                                                    );
                                            case "PROCESANDO":
                                                return(
                                                   <a id="state_processing">EN PROCESO</a>
                                                );
                                            case "FINALIZADO":
                                                return(
                                                   <a id="state_finished">TERMINADO</a>
                                                );
                                            case "RECHAZADO":
                                                return(
                                                   <a id="state_rejected">RECHAZADO</a>
                                                );
                                    }
                                })()}
                                </div>
                             
                                <strong>cambiar estado de la revision</strong>
                                <div className="center">
                                    <select name="estado" ref={this.estadoRef} onChange={this.changeState}>
                                        <option value=""></option>
                                        <option value="NUEVO">NO REVISADO</option>
                                        <option value="PROCESANDO">EN PROCESO</option>
                                        <option value="FINALIZADO">FINALIZADO</option>
                                        <option value="RECHAZADO">RECHAZADO</option>
                                    </select>
                                    <button className="btn_join" onClick={this.cambiarEstado}>Actualizar</button>
                                    <br />
                                </div>
                                <br />
                               {/* <button id="btn_deleteRegistro" onClick={this.deleteDictamen}>Borrar Registro</button>*/} 
                            </div>
                            </div>
                            </div>
                      
                                                
                         {/**fincontenedor */}
                        <br />
                        <br />
                               <tbody>
                                        <tr>
                                            <td className="table_lista"><strong>Documentos</strong></td>
                                            <td className="table_lista"><strong>Comentario</strong></td>
                                        </tr>
                                    </tbody>
                                    {this.state.listar.map((lista1, i) =>
                                        <tbody key={i}>
                                            <tr>
                                                <td className="table_lista">{lista1.nombreDoc}</td>
                                                <td className="table_lista">{lista1.comentario}</td>
                                                <td><Link to={'/doc/PdfServicio/' + lista1.idDoc}target="_blank" id="btn_watch">Visualizar</Link></td>
                                                <td><a  href={ "/docServicio/getDoc/" + lista1.idDoc} download  id="btn_downLoad">Descargar</a></td>
                                                <td><BorrarDoc
                                                idLista={lista1.idLista}
                                                idDoc={lista1.idDoc}
                                                url= "docServicio/deleteDoc/"
                                                redirect={lista1.idAlumno}
                                                /></td>
                                                <td><ActualizarComentario
                                                idLista={lista1.idLista}
                                                idAlumno= {lista1.idAlumno}
                                                idDoc={lista1.idDoc}
                                                idTramite={lista1.idTramite}
                                                nombreDoc={lista1.nombreDoc}
                                                comentario={lista1.comentario}
                                                /></td>
                                            </tr>
                                    </tbody>
                                    )}
                                    <br />
                                    <div  className="archivosAdminCenter" ><strong>Enviar archivo PDF</strong></div> <br /> 
                                    <input type="file" name = "file" onChange={this.fileChange} />
                                    {(() => {
                                    switch(this.state.statusArchivo){   
                                        case "false":
                                        return (
                                        <a className="warning_search">¡Seleccione un Archivo para Registrar!</a>
                                        );
                                        break;
                                        default:
                                            break;
                                    }
                                    })()} 
                                </div>

                                <br/>
                                <button className="btn"  onClick = {this.upLoad}>ENVIAR</button> 
                            </div>
                            </div>
                           
               
            );
        
    }//Fin de Render
}//Fin de Class AdminServicioArchivos
export default AdminServicioArchivos;
