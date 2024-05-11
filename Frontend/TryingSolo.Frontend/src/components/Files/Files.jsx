import favorite from "../../assets/Files/favorite.svg"
import favoriteFill from "../../assets/Files/favoriteFill.svg"
import fileExce from "../../assets/Files/excel.svg"
import del from "../../assets/Files/delete.svg"

import Search from "../Search/Search";
import styles from "./Files.module.css"
import { useContext, useEffect, useRef, useState } from "react";
import api from "../../api/helpAxios";
import useParseToken from "../../hooks/useParseToken";
import useUpdateToken from "../../hooks/useUpdateToken"
import AuthContext from "../Context/AuthProvider";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { useNavigate } from "react-router-dom";
import useRediresctionRefreshToken from "../../hooks/useRedirectionRefreshToken";

const Files = () => {
    const filePicker = useRef(null);
    const errorMessage = useRef(null);
    const [uploadFile, setUploadFile] = useState(null);
    const [files, setFiles] = useState([]);
    const [viewFiles, setViewFiles] = useState([]);
    const { auth, setAuth } = useContext(AuthContext);
    const navigate = useNavigate();

    const HandleFilterFiles = (e) => {
        const value = e.target.value;

        setViewFiles(files.filter(s => s.name.startsWith(value)));
    }

    const FilePick = () => {
        filePicker.current.click();
    }

    const AddFile = async (e) => {
        e.preventDefault();

        if (uploadFile == null) {
            errorMessage.current.textContent = "Файл не выбран";
            return;
        }
        const formData = new FormData();
        formData.append("file", uploadFile);

        const token = localStorage.getItem("token");

        try {

            var response = await api.post("/File/AddFile",
                formData,
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`
                    }
                });



            if (response.data.statusCode != 0) {
                errorMessage.current.textContent = response.data.description;
                return;
            }

            errorMessage.current.textContent = "";
            setUploadFile(null);
            filePicker.current.value = null;
            setFiles(prevFiles => [...prevFiles, response.data.data]);
            setViewFiles(prevFiles => [...prevFiles, response.data.data]);

        }
        catch (error) {
            console.log(error)
            if (error.request.status == 0) {
                await useRediresctionRefreshToken(() => { AddFile(e) },
                    setAuth,
                    navigate,
                    useUpdateToken,
                    useParseToken);
            }
        }
    }

    const GetAllFiles = async () => {
        try {
            const token = localStorage.getItem("token");

            var response = await api.get("/File/GetAllFiles", {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.data.statusCode != 0) {
                errorMessage.current.textContent = response.data.description;
                return;
            }

            setFiles(response.data.data);
            setViewFiles(response.data.data);
        }
        catch (error) {
            console.log(error)
            if (error.request.status == 0) {
                await useRediresctionRefreshToken(() => { GetAllFiles() },
                    setAuth,
                    navigate,
                    useUpdateToken,
                    useParseToken);
            }
        }
    }

    const DeleteFile = async (e, id) => {
        e.preventDefault();
        console.log(id);

        try {
            const token = localStorage.getItem("token");
            var response = await api.post("/File/DeleteFile",
                {
                    IdFile: id
                },
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                })

            if (response.data.statusCode != 0) {
                errorMessage.current.textContent = response.data.description;
                return;
            }

            const newFiles = files.filter(file => file.id != id);
            setFiles(newFiles);
            setViewFiles(newFiles);

        }
        catch (error) {
            console.log(error)
            if (error.request.status == 0) {

                await useRediresctionRefreshToken(() => { DeleteFile() },
                    setAuth,
                    navigate,
                    useUpdateToken,
                    useParseToken);
            }
        }
    }

    const ChangeDescriptionFile = async (e, id, description) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");

            var response = await api.post("/File/ChangeDescriptionExcelFile",
                {
                    IdFile: id,
                    Description: description
                },
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });

            if (response.data.statusCode != 0) {
                errorMessage.current.textContent = response.data.description;
            }
        }
        catch (error) {
            console.log(error)
            if (error.request.status == 0) {
                await useRediresctionRefreshToken(() => { ChangeDescriptionFile(e, id, description) },
                    setAuth,
                    navigate,
                    useUpdateToken,
                    useParseToken);
            }
        }
    }

    const SelectFile = async (e, id, isSelected) => {
        e.preventDefault();

        try {
            var token = localStorage.getItem("token");

            var response = await api.post("/File/SelectFile", {
                IdFile: id,
                IsSelectedFile: !isSelected
            }, {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.data.statusCode != 0) {
                errorMessage.current.textContent = response.data.description;
                return;
            }

            const newFiles = files.map(file => {
                if (file.id === id) {
                    return { ...file, isSelected: !file.isSelected };
                }
                return file;
            });

            setFiles(newFiles);
            setViewFiles(newFiles);

            console.log(response);
        } catch (error) {
            console.log(error);
            if (error.request.status == 0) {
                await useRediresctionRefreshToken(() => { SelectFile(e, id, isSelected) },
                    setAuth,
                    navigate,
                    useUpdateToken,
                    useParseToken);
            }
        }
    }

    useEffect(() => {
        var fatchData = async () => {
            await GetAllFiles();
        }
        fatchData();

        var lisener = async () => {

            const token = localStorage.getItem("token");
            const { id, login, roles } = useParseToken(token);

            var connection = new HubConnectionBuilder()
                .withUrl("https://localhost:7214/ReciveEmailMessage")
                .withAutomaticReconnect()
                .build();

            connection.on("ReceiveSheduleChanging", async (message) => {
                console.log(message);
                console.log("Сработала оповещалска");
                try {

                    var sendEmailsResponse = await api.get("/File/SendEmailChangingShedule",
                        {
                            withCredentials: true,
                            headers: {
                                'Content-Type': 'multipart/form-data',
                                'Authorization': `Bearer ${token}`
                            }
                        }
                    );

                    console.log(sendEmailsResponse);
                }
                catch (error) {
                    console.log(error);
                }
            });

            try {
                console.log("запуск");
                await connection.start();
                console.log(connection);
            }
            catch (error) {
                console.log(error);
            }
        }

        lisener();
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.headerText}>
                <h1>File Setting</h1>
            </div>
            <Search HandleFilter={HandleFilterFiles} placeholder="поиск по файлам" />
            <main className={styles.main}>
                <section className={styles.filesContainer}>
                    {viewFiles.map(file => (
                        <File key={file.id} id={file.id} isSelected={file.isSelected} name={file.name}
                            img={file.isSelected ? favoriteFill : favorite}
                            description={file.description} DeleteFile={DeleteFile}
                            ChangeDescription={ChangeDescriptionFile}
                            SelectFile={SelectFile} />
                    ))}

                </section>
                <div className={styles.functions}>
                    <div className={styles.functionsWrapper}>
                        <form onSubmit={AddFile}>
                            <div className={styles.addFile}>
                                <section className={styles.viewInput}>
                                    <img src={fileExce} alt="image file" width={70} />
                                    <span className={styles.fileName}>{uploadFile == null ? "файл не выбран" : uploadFile.name}</span>
                                </section>
                                <button type="button" onClick={FilePick} className={styles.btn}>Выбрать файл</button>
                                <input type="file" onChange={(e) => { setUploadFile(e.target.files[0]); errorMessage.current.textContent = ""; }}
                                    accept=".xlsx" ref={filePicker} />
                            </div>
                            <div className={styles.btnContainer}>
                                <button type="submit" className={`${styles.btn}`}>Добавить</button>
                            </div>
                        </form>
                        <div className={styles.error}>
                            <label ref={errorMessage}></label>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

const File = ({ id, isSelected, name, description, DeleteFile, ChangeDescription, SelectFile }) => {
    const [descriptionInner, setDescriptionInner] = useState(description);


    return (
        <div className={styles.file}>
            <div className={styles.flagContainer}>
                <button type="button" onClick={(e) => { SelectFile(e, id, isSelected) }} className={styles.wrapperFlag}>
                    <img src={isSelected ? favoriteFill : favorite} alt="favorite" height={45} />
                </button>
            </div>
            <div className={styles.fileContainer}>
                <img src={fileExce} alt="fileExcel" height={80} />
            </div>
            <div className={styles.info}>
                <h2>{name}</h2>
                <input type="text" onBlur={(e) => { ChangeDescription(e, id, descriptionInner) }}
                    onChange={(e) => { setDescriptionInner(e.target.value) }} maxLength={70} placeholder="описание" defaultValue={descriptionInner} />
            </div>
            <div className={styles.deleteContainer}>
                <button type="button" onClick={(e) => { DeleteFile(e, id) }}>
                    <img src={del} alt="delete" height={20} />
                </button>
            </div>
        </div>
    )
}

export default Files;