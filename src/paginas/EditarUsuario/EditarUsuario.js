import { Sidebar } from '../../componentes/Sidebar/Sidebar';
import { Topbar } from '../../componentes/Topbar/Topbar';
import style from './EditarUsuario.module.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import UsuarioApi from '../../services/UsuarioApi';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/esm/Button';

export function EditarUsuario() {

    const location = useLocation();
    const navigate = useNavigate();

    const [id] = useState(location.state);

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [tipo, setTipoUsuario] = useState('');
    const [tiposUsuarios, setTiposUsuarios] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isFormValid()) {
            console.log("Dados enviados:", { id, nome, email, tipo });
            await UsuarioApi.atualizarAsync(id, nome, email, tipo);
            navigate('/usuarios');
        } else {
            alert('Por favor,  preencha todos  os campos.');
        }
    };

    useEffect(() => {
        const buscarTiposUsuarios = async () => {
            try {
                const tipos = await UsuarioApi.listarTiposUsuarioAsync();
                setTiposUsuarios(tipos);
            } catch (error) {
                console.error('Erro ao buscar tipos de usuário:', error);
            }
        };

        const buscarDadosUsuario = async () => {
            try {
                const usuario = await UsuarioApi.obterAsync(id);
                setNome(usuario.nome);
                setEmail(usuario.email);
                setTipoUsuario(usuario.tipo);
            } catch (error) {
                console.error('Erro ao buscar dados do usuario:', error);
            }
        }

        buscarTiposUsuarios();
        buscarDadosUsuario();

    }, [id]);

    const isFormValid = () => {
        return nome && email && tipo;
    };

    return (
        <Sidebar>
            <Topbar>
                <div className={style.pagina_conteudo}>
                    <h3>Editar usuário</h3>

                    <Form onSubmit={handleSubmit}>

                        <Form.Group controlId="formNome" className="mb-3">
                            <Form.Label>Nome</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Digite seu nome"
                                name="nome"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formEmail" className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Digite seu email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formTipoUsuario" className="mb-3">
                            <Form.Label>Tipo de Usuário</Form.Label>
                            <Form.Control
                                as="select"
                                name="tipoUsuario"
                                value={tipo}
                                onChange={(e) => setTipoUsuario(e.target.value)}
                                required
                            >

                                {tiposUsuarios.map((tipo) => (
                                    <option value={tipo.id}>{tipo.nome}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                        <Button variant='primary' type='submit' disabled={!isFormValid()}>
                            Salvar
                        </Button>

                    </Form>
                </div>
            </Topbar>
        </Sidebar>
    )
}