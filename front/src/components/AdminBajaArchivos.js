import React from 'react';
import { Redirect,Link } from 'react-router-dom';
import axios from 'axios';
import BorrarDoc from './BorrarDoc';
import ActualizarComentario from './ActualizarComentario';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

class AdminBajaArchivos extends React.Component {

    estadoRef = React.createRef();
    comentarioRef=React.createRef();

    state = {
        idAlumno: this.props.id,
        statusArchivo: null,
        file: null,
        status: null,
        lista: {},
        listar:[],

        comentario:{},
        Baja: {
            idSolicitud:"null"
        },
        alumno: {},
        usuario: {},
        cambioEstado: {},
        statusBaja: false,
        statusEstado: null,
    };

    changeState = () =>{
        if(this.estadoRef === "undefined"){ 
        this.setState({
            cambioEstado:{
                idAlumno:this.props.id,
                idSolicitud: this.state.Baja.idSolicitud,
                tipoDeBaja: this.state.Baja.tipoDeBaja,
                horas: this.state.Baja.horas,
                semestre: this.state.Baja.semestre,
                egresado: this.state.Baja.egresado,
                registroSS: this.state.Baja.registroSS,
                prestatario: this.state.Baja.prestatario,
                programaSS: this.state.Baja.programaSS,
                fechaInicio: this.state.Baja.fechaInicio,
                fechaTermino: this.state.Baja.fechaTermino,
                estado: this.estadoRef.current.value,
                fechaRegistro: this.state.Baja.fechaRegistro,
                revisado:this.state.Baja.revisado
            },
            statusBaja:true,
        })
    }
    else{
        this.setState({
            cambioEstado:{
                idAlumno:this.props.id,
                idSolicitud: this.state.Baja.idSolicitud,
                tipoDeBaja: this.state.Baja.tipoDeBaja,
                horas: this.state.Baja.horas,
                semestre: this.state.Baja.semestre,
                egresado: this.state.Baja.egresado,
                registroSS: this.state.Baja.registroSS,
                prestatario: this.state.Baja.prestatario,
                programaSS: this.state.Baja.programaSS,
                fechaInicio: this.state.Baja.fechaInicio,
                fechaTermino: this.state.Baja.fechaTermino,
                fechaRegistro: this.state.Baja.fechaRegistro,
                estado: this.estadoRef.current.value,
                revisado:cookies.get('nombre'),
            },
            statusBaja:true,
        })  
    }
    }
    componentWillMount = () => {
       this.getLista();
        //this.getAlumno();
           this.getBaja();
    } 
    getBaja = () => {
        axios.get("solicitudBaja/findIdAlumno/"+ this.props.id)
        .then(response => {
        this.setState({
            Baja: response.data,
            cambioEstado:response.data,
        });
        } );   
       console.log("id props " + this.state.Baja.tipoDeBaja)
    }//Fin de getTipoBaja()

 

    
    getAlumno = () => {
        axios.get("/alumno/find/" + this.state.idAlumno)
            .then(response => {
                this.setState({
                    alumno: response.data,
                });
            });
    }//Fin de getAlumno()

    deleteTipoBaja = () => {
        axios.delete("solicitudBaja/delete/"+this.props.id)
        .then(res => {
            window.location.href = "./" + this.props.id
        })
    }//Fin de deleteTipoBaja

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
        if(this.state.statusBaja === true){
            
        this.changeState();
        axios.patch("solicitudBaja/update", this.state.cambioEstado)
            .then(res => {
                this.getBaja();
            });
            window.location.reload(true);
        }
        else{
            console.log("elid de baaja es " +this.state.statusBaja)
        }
    }//Fin de Cambiar Estado



    fileChange = (event) => {
       this.setState({
            file: event.target.files[0]
        });
    }

    getLista = () => {
        axios.get( "lista/findBaja/" + this.props.id)
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

    upLoad = () => {
        if(this.state.file && this.state.file != null && this.state.file != undefined){
            const fd = new FormData();
            console.log(this.state);
            fd.append('file', this.state.file, this.state.file.name)
            console.log(this.state.file.name)
                axios.post("docBaja/upload/" + this.state.file.name + this.props.id, fd)
                    .then(res =>{
                        this.setState({
                            lista:{
                                idAlumno: this.props.id,
                                nombreDoc: res.data,
                                idTramite: 3,
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
                            <strong>BAJA DE SERVICIO SOCIAL</strong>
                                <div>
                                <br/>
                                <input type="checkbox" id="btn-modal" />
                                <label htmlFor="btn-modal" className="btn" onClick={this.getEmail}>INFORMACIÓN DE LA SOLICITUD</label>
                                 <div className="modal">
                                <div className="contenedor">
                                    <h1>Baja de Servicio Social</h1>
                                    <label htmlFor="btn-modal">X</label>
                                    <div className="contenido">
                                <div>
                                    <strong>Fecha de Registro:</strong>{this.state.Baja.fechaRegistro}
                                </div>
                                <div>
                                    <strong>Semestre:</strong> {this.state.Baja.semestre}
                                </div>
                                <div>
                                    <strong>Registro de Servicio Social:</strong>{this.state.Baja.registroSS}
                                </div>
                                <div>
                                    <strong>Tipo de Baja:</strong>{this.state.Baja.tipoDeBaja} 
                                </div>
                                <div>
                                    <strong>Horas:</strong>{this.state.Baja.horas} 
                                </div>
                                <div>
                                    <strong>Programa de Servicio Social:</strong>{this.state.Baja.programaSS}
                                </div>
                                <div>
                                    <strong>Prestatario:</strong> {this.state.Baja.prestatario}
                                </div>
                                <div>
                                    <strong>Fecha de Inicio:</strong>{this.state.Baja.fechaInicio} 
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
                                
                                <div>
                                    <strong>Revisado por: </strong> {this.state.Baja.revisado}
                                </div>
                                <div>
                                    <strong>Estado:</strong>{this.state.Baja.estado}
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
                               {/**  <button id="btn_deleteRegistro" onClick={this.deleteDictamen}>Borrar Registro</button>*/}
                            </div>
                            </div>
                        </div>{/**fincontenedor */}
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
                                                <td><Link to={"/doc/PdfBaja/" + lista1.idDoc}target="_blank" id="btn_watch">Visualizar</Link></td>
                                                <td><a  href={ "/docBaja/getDoc/" + lista1.idDoc} download  id="btn_downLoad">Descargar</a></td>

                                                <td><BorrarDoc
                                                idLista={lista1.idLista}
                                                idDoc={lista1.idDoc}
                                                url= "docBaja/deleteDoc/"
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
}//Fin de Class AdminBajaArchivos
export default AdminBajaArchivos;
