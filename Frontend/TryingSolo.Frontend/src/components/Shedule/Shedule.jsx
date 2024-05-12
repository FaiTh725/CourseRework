import { useContext, useEffect, useState } from "react";
import styles from "./Shedule.module.css"
import useRediresctionRefreshToken from "../../hooks/useRedirectionRefreshToken";
import useParseToken from "../../hooks/useParseToken";
import useUpdateToken from "../../hooks/useUpdateToken";
import api from "../../api/helpAxios";
import AuthContext from "../Context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";

import cross from "../../assets/Modal/cross.png"


const Shedule = () => {

    const [folovingGroup, setFolovingGroup] = useState([]);
    const [allGroup, setAllGroup] = useState([]);
    const [allCourses, setAllCourses] = useState([]);

    const [selectedCourse, setSelectedCourse] = useState();
    const [selectedAddedGroup, setSelectedAddedGroup] = useState();
    const [selectedSheduleGroup, setSelectedSheduleGroup] = useState();

    const [sheduleGroup, setSheduleGroup] = useState([]);
    const [pickedShedule, setPickedShedule] = useState([]);

    const currentDay = new Date();
    const [selectedDayOfWeek, setSelectedDayOfWeek] = useState(currentDay.getDay() == 0 ? 1 : currentDay.getDay());
    const [numberWeek, setNumberWeek] = useState(1);

    const addGroupError = useRef(null);

    const { auth, setAuth } = useContext(AuthContext);
    const navigate = useNavigate();

    const GetAllCourse = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await api.get("/Shedule/GetAllCources", {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.data.statusCode != 0) {
                console.log(response.data.description);
                return;
            }

            console.log(response);

            if (response.data.data.length > 0) {
                setSelectedCourse(response.data.data[0].course);
            }

            setAllCourses(response.data.data);
        }
        catch (error) {
            if (error.request.status == 0) {
                await useRediresctionRefreshToken(() => { GetAllCourse() },
                    setAuth,
                    navigate,
                    useUpdateToken,
                    useParseToken);
            }
        }
    }

    const GetAllGroup = async () => {

        try {
            const token = localStorage.getItem("token");

            const response = await api.get("/Shedule/GetAllGroup",
                {
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    params: {
                        course: selectedCourse
                    }
                }
            );

            if (response.data.statusCode != 0) {
                console.log(response.data.description);
                return;
            }

            console.log(response);
            setAllGroup(response.data.data);
            console.log(response.data.data[0].id);
            setSelectedAddedGroup(response.data.data[0].id);
        }
        catch (error) {
            if (error.request.status == 0) {
                await useRediresctionRefreshToken(() => { GetAllGroup() },
                    setAuth,
                    navigate,
                    useUpdateToken,
                    useParseToken);
            }
        }
    }

    const GetFolovingGroup = async () => {
        try {
            const token = localStorage.getItem("token");
            const { id, login, role } = useParseToken(token);

            const response = await api.get("/Shedule/GetFolovingGroup", {
                withCredentials: true,
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                params: {
                    idProfile: id
                }
            });

            console.log(response);

            setFolovingGroup(response.data.data);

            if (response.data.data.length > 0) {
                setSelectedSheduleGroup(response.data.data[0].id);
            }
        }
        catch (error) {
            if (error.request.status == 0) {
                await useRediresctionRefreshToken(() => { GetFolovingGroup() },
                    setAuth,
                    navigate,
                    useUpdateToken,
                    useParseToken);
            }
        }
    }

    const GetSheduleGroup = async (idGroup) => {

        try {
            const token = localStorage.getItem("token");

            const response = await api.get("/Shedule/GetSheduleGroup",
                {
                    withCredentials: true,
                    headers: {
                        "Authorization": `Bearer ${token}`
                    },
                    params: {
                        idGroup: idGroup
                    }
                }
            );

            if (response.data.statusCode != 0) {
                console.log(response.data.description);
            }

            console.log(response);

            setSheduleGroup(response.data.data);

        }
        catch (error) {
            if (error.request.status == 0) {
                await useRediresctionRefreshToken(() => { GetSheduleGroup(idGroup) },
                    setAuth,
                    navigate,
                    useUpdateToken,
                    useParseToken);
            }
        }
    }

    const DeleteFolovingGroup = async (e, deletedGroup) => {
        e.preventDefault();
        addGroupError.current.textContent = "";

        try {
            const token = localStorage.getItem("token");
            const { id, login, role } = useParseToken(token);

            const response = await api.post("/Shedule/DeleteFolovingGroup", {
                idProfile: id,
                idShedule: deletedGroup
            },
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });


            console.log(response);

            const indexDeletedGroup = folovingGroup.indexOf(folovingGroup.find(x => x.id == deletedGroup));

            var newFolovingGroup = folovingGroup.filter(x => x.id != deletedGroup);
            setFolovingGroup(newFolovingGroup);

            if (deletedGroup == selectedSheduleGroup) {
                if (indexDeletedGroup != 0) {
                    setSelectedSheduleGroup(newFolovingGroup[indexDeletedGroup - 1].id);
                }
                else {
                    setSelectedSheduleGroup();
                    setSheduleGroup([]);
                    setPickedShedule([]);
                }
            }
        }
        catch (error) {
            if (error.request.status == 0) {
                await useRediresctionRefreshToken(() => { DeleteFolovingGroup(e) },
                    setAuth,
                    navigate,
                    useUpdateToken,
                    useParseToken);
            }
        }
    }

    const AddFolovingGroup = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");
            const { id, login, role } = useParseToken(token);

            const response = await api.post("/Shedule/AddFolovingGroup", {
                idProfile: id,
                idShedule: selectedAddedGroup
            },
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

            if (response.data.statusCode != 0) {
                addGroupError.current.textContent = response.data.description;
                return;
            }

            console.log(response);
            setFolovingGroup(prev => [...prev, response.data.data]);
            setSelectedSheduleGroup(response.data.data.id);
        }
        catch (error) {
            if (error.request.status == 0) {
                await useRediresctionRefreshToken(() => { AddFolovingGroup(e) },
                    setAuth,
                    navigate,
                    useUpdateToken,
                    useParseToken);
            }
        }
    }

    useEffect(() => {
        if (sheduleGroup.length > 0) {
            setPickedShedule([]);

            sheduleGroup[numberWeek - 1].weekShedules[selectedDayOfWeek - 1].subjectsDayOfWeek.forEach(subjectInfo => {
                const subjectsData = subjectInfo.name.replace(" уппа ", " |  ");
                const time = subjectInfo.time;
                const splitName = subjectsData.split(" | ");
                const id = subjectInfo.id;

                var nameSubject = "";
                var corpus = "";
                var audience = "";
                var teacher = "";

                if (splitName.length != 1) {

                    nameSubject = splitName[0];
                    const splitExtentionName = splitName[1].split(" ");

                    if (nameSubject.startsWith("Физическая")) {
                        teacher = splitName[1]
                    }
                    else {
                        corpus = splitExtentionName[splitExtentionName.length - 2];
                        audience = splitExtentionName[splitExtentionName.length - 1];
                        teacher = splitExtentionName.slice(0, splitExtentionName.length - 2).join(" ");
                    }
                }
                else {
                    if (splitName[0].startsWith("Физическая")) {
                        nameSubject = splitName[0];
                    }
                    else {
                        const splitExtentionName = splitName[0].split(" ");

                        audience = splitExtentionName[splitExtentionName.length - 1];
                        corpus = splitExtentionName[splitExtentionName.length - 2];
                        nameSubject = splitExtentionName.slice(0, splitExtentionName.length - 2).join(" ");

                    }
                }
                setPickedShedule(prev => [...prev,
                {
                    id: id,
                    time: time,
                    teacher: teacher,
                    corpus: corpus.slice(2),
                    audience: audience,
                    nameSubject: nameSubject
                }]);
            });
        }
    }, [selectedDayOfWeek, numberWeek, sheduleGroup]);

    useEffect(() => {
        if (selectedSheduleGroup != null) {

            const fatchSheduleGroup = async () => {
                await GetSheduleGroup(selectedSheduleGroup);
            }

            fatchSheduleGroup();
        }
    }, [selectedSheduleGroup]);

    useEffect(() => {
        if (selectedCourse != null) {

            const getGroups = async () => {
                await GetAllGroup();
            }

            getGroups();
        }
    }, [selectedCourse]);

    useEffect(() => {
        var fatchAllCourse = async () => {
            await GetAllCourse();
        };

        const fatchFolovingGroups = async () => {
            await GetFolovingGroup();
        }

        fatchAllCourse();
        fatchFolovingGroups();
    }, []);

    return (
        <main className={styles.main}>
            <h2>Расписание</h2>
            <section className={styles.addGroup}>
                <div>
                    <p>Группа</p>
                </div>
                <div className={styles.numberWeek}>
                    {allCourses.map(course => (
                        <button key={course.course}
                            type="button"
                            onClick={(e) => { setSelectedCourse(course.course); addGroupError.current.textContent = ""; }}
                            className={selectedCourse == course.course ?
                                `${styles.btnRadioChecked}` :
                                styles.btnRadio}>{course.course} курс</button>
                    ))}
                </div>
                <div className={styles.selectGroup}>
                    <select onChange={e => { setSelectedAddedGroup(e.target.value); addGroupError.current.textContent = ""; }}>
                        {allGroup.map(group => (
                            <option key={group.id} value={group.id} className={styles.option}>{group.group}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <button onClick={async (e) => { AddFolovingGroup(e) }} className={styles.btn}>Добавить</button>
                </div>
                <div>
                    <label className={styles.errorMessage} ref={addGroupError}></label>
                </div>
            </section>
            <section className={styles.folovingGroups}>
                <div>
                    <p>Отслеживаемые группы</p>
                </div>
                <ul className={styles.folovingGroup}>
                    {folovingGroup.map(group => (
                        <div key={`group-div-${group.id}`} className={styles.gr}
                            onMouseEnter={() => {
                                var btn = document.getElementById(`${group.id} ${styles.deleteBtn}`);
                                btn.style.display = "block"
                            }}
                            onMouseLeave={() => {
                                var btn = document.getElementById(`${group.id} ${styles.deleteBtn}`);
                                btn.style.display = "none"
                            }}>
                            <li className={selectedSheduleGroup == group.id ? styles.folovGroupSelected : styles.folovGroup}
                            >
                                <p onClick={() => { setSelectedSheduleGroup(group.id) }}>{group.group}</p>
                                <button id={`${group.id} ${styles.deleteBtn}`} className={styles.deleteBtn}
                                    onClick={(e) => { DeleteFolovingGroup(e, group.id) }}>
                                    <img src={cross} alt="cross" height={14} />
                                </button>
                            </li>

                        </div>

                    ))}
                </ul>
            </section>
            {sheduleGroup.length > 0 && (
                <section className={styles.sheduleGroup}>
                    <div className={styles.optionShedule}>
                        <div className={styles.nameGroup}>
                            <p>Группа</p>
                            <p>{sheduleGroup != null ? sheduleGroup[numberWeek - 1].name : ""}</p>
                        </div>
                        <div className={styles.numberWeek}>
                            <button onClick={() => { setNumberWeek(1) }} className={numberWeek == 1 ? styles.btnRadioChecked : styles.btnRadio}>1 неделя</button>
                            <button onClick={() => { setNumberWeek(2) }} className={numberWeek == 2 ? styles.btnRadioChecked : styles.btnRadio}>2 неделя</button>
                        </div>

                    </div>
                    <ul className={styles.dayOfWeek}>
                        <li onClick={() => { setSelectedDayOfWeek(1) }} className={selectedDayOfWeek == 1 ? styles.btnRadioDayOfWeeekChecked : styles.btnRadioDayOfWeeek}>Понедельник</li>
                        <li onClick={() => { setSelectedDayOfWeek(2) }} className={selectedDayOfWeek == 2 ? styles.btnRadioDayOfWeeekChecked : styles.btnRadioDayOfWeeek}>Вторник</li>
                        <li onClick={() => { setSelectedDayOfWeek(3) }} className={selectedDayOfWeek == 3 ? styles.btnRadioDayOfWeeekChecked : styles.btnRadioDayOfWeeek}>Среда</li>
                        <li onClick={() => { setSelectedDayOfWeek(4) }} className={selectedDayOfWeek == 4 ? styles.btnRadioDayOfWeeekChecked : styles.btnRadioDayOfWeeek}>Четверг</li>
                        <li onClick={() => { setSelectedDayOfWeek(5) }} className={selectedDayOfWeek == 5 ? styles.btnRadioDayOfWeeekChecked : styles.btnRadioDayOfWeeek}>Пятница</li>
                        <li onClick={() => { setSelectedDayOfWeek(6) }} className={selectedDayOfWeek == 6 ? styles.btnRadioDayOfWeeekChecked : styles.btnRadioDayOfWeeek}>Суббота</li>
                    </ul>
                    <section className={styles.table}>
                        {pickedShedule.length > 0 && (
                            <table className={styles.tableShedule}>
                                <thead className={styles.theadShedule}>
                                    <tr>
                                        <th className={styles.firstTHead}>Время</th>
                                        <th>Предмет</th>
                                        <th>Преподаватель</th>
                                        <th>Корпус</th>
                                        <th className={styles.lastTHead}>Аудитория</th>
                                    </tr>
                                </thead>
                                <tbody className={styles.tbodyShedule}>
                                    {pickedShedule.map(subject => (
                                        <tr key={subject.id}>
                                            <td>{subject.time}</td>
                                            <td>{subject.nameSubject}</td>
                                            <td>{subject.teacher}</td>
                                            <td>{subject.audience}</td>
                                            <td>{subject.corpus}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                    </section>
                </section>
            )}

        </main>
    )
}

export default Shedule;