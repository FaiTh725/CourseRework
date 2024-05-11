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

// при удалени группы из списка выбирать следующую или предудыщую если она есть
const Shedule = () => {
    const [week, setWeek] = useState(1);
    const [dayOfWeek, setDayOfWeek] = useState();

    const [folovingGroup, setFolovingGroup] = useState([]);
    const [allGroup, setAllGroup] = useState([]);
    const [allCourses, setAllCourses] = useState([]);

    const [selectedCourse, setSelectedCourse] = useState();
    const [selectedAddedGroup, setSelectedAddedGroup] = useState();
    const [selectedSheduleGroup, setSelectedSheduleGroup] = useState();

    const [shedule, setShedule] = useState({});

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

            if (response.data.data.length > 0) {
                setSelectedSheduleGroup(response.data.data[0].id);
            }

            setFolovingGroup(response.data.data);
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
        }
        catch (error) {
            if (error.request.status == 0) {
                await useRediresctionRefreshToken(() => { GetSheduleGroup(e, idGroup) },
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

            var newFolovingGroup = folovingGroup.filter(x => x.id != deletedGroup);
            setFolovingGroup(newFolovingGroup);
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
        const fatchSheduleGroup = async () => {
            await GetSheduleGroup(selectedSheduleGroup);
        }

        fatchSheduleGroup();
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
                            <li onClick={(e) => { setSelectedSheduleGroup(group.id) }} className={selectedSheduleGroup == group.id ? styles.folovGroupSelected : styles.folovGroup}
                            >
                                <p>{group.group}</p>
                                <button id={`${group.id} ${styles.deleteBtn}`} className={styles.deleteBtn}
                                    onClick={(e) => { DeleteFolovingGroup(e, group.id) }}>
                                    <img src={cross} alt="cross" height={14} />
                                </button>
                            </li>

                        </div>

                    ))}
                </ul>
            </section>
            <section className={styles.sheduleGroup}>
                <div className={styles.optionShedule}>
                    <div className={styles.nameGroup}>
                        <p>Группа</p>
                        <p>10702122</p>
                    </div>
                    <div className={styles.numberWeek}>
                        <button className={styles.btnRadio}>1 неделя</button>
                        <button className={styles.btnRadio}>2 неделя</button>
                    </div>

                </div>
                <ul className={styles.dayOfWeek}>
                    <li className={styles.btnRadioDayOfWeeek}>Понедельник</li>
                    <li className={styles.btnRadioDayOfWeeek}>Вторник</li>
                    <li className={styles.btnRadioDayOfWeeek}>Среда</li>
                    <li className={styles.btnRadioDayOfWeeek}>Четверг</li>
                    <li className={styles.btnRadioDayOfWeeek}>Пятница</li>
                    <li className={styles.btnRadioDayOfWeeek}>Суббота</li>
                </ul>
                <section className={styles.table}>

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
                            <tr>
                                <td>8:00</td>
                                <td>Системный анализ и машинное моделирование</td>
                                <td>ст пр Борисова</td>
                                <td>8</td>
                                <td>2П</td>
                            </tr>
                            <tr>
                                <td>8:00</td>
                                <td>Системный анализ и машинное моделирование</td>
                                <td>ст пр Борисова</td>
                                <td>8</td>
                                <td>2П</td>
                            </tr>
                            <tr>
                                <td>8:00</td>
                                <td>Системный анализ и машинное моделирование</td>
                                <td>ст пр Борисова</td>
                                <td>8</td>
                                <td>2П</td>
                            </tr>
                            <tr>
                                <td>8:00</td>
                                <td>Системный анализ и машинное моделирование</td>
                                <td>ст пр Борисова</td>
                                <td>8</td>
                                <td>2П</td>
                            </tr>
                        </tbody>
                    </table>
                </section>
            </section>
        </main>
    )
}

export default Shedule;