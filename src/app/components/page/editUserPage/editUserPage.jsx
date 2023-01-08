import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { validator } from "../../../utils/validator";
import TextField from "../../common/form/textField";
import SelectField from "../../common/form/selectField";
import RadioField from "../../common/form/radioField";
import MultiSelectField from "../../common/form/multiSelectField";
import BackHistoryButton from "../../common/backButton";
import { useProfessions } from "../../../hooks/useProfession";
import { useQuality } from "../../../hooks/useQuality";
import { useAuth } from "../../../hooks/useAuth";

const EditUserPage = () => {
    const { isLoading: qualitiesLoading, qualities: qualitiesList } = useQuality();
    const qualities = qualitiesList.map((q) => ({
        label: q.name,
        value: q._id
    }));
    const { isLoading: professionsLoading, professions: professionsList } = useProfessions();
    const professions = professionsList.map((p) => ({
        label: p.name,
        value: p._id
    }));
    const history = useHistory();
    const params = useParams();
    const { userId } = params;
    const [data, setData] = useState({
        name: "",
        email: "",
        profession: "",
        sex: "male",
        qualities: []
    });
    const { currentUser, updateUser } = useAuth();
    const [errors, setErrors] = useState({});
        const transformData = (data) => {
           return data.map((qualId) => ({
            label: qualities.find((quality) => quality.value === qualId).label,
            value: qualId
        }));
    };
    useEffect(() => {
        setData({
            ...currentUser
        });
        if (currentUser._id !== userId) {
            history.push(`/users/${currentUser._id}/edit`);
        }
    }, [currentUser]);

    const getQualities = (data) => {
       return data.map(q => q.value);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        const isValid = validate();
        if (!isValid) return;
        console.log(data);
        const updatedUser = {
             ...data,
            qualities: getQualities(data.qualities)
        };
        console.log(updatedUser);
        updateUser(updatedUser);
        history.push(`/users/${currentUser._id}`);
        // const { profession, qualities } = data;
        // api.users
        //     .update(userId, {
        //         ...data,
        //         profession: getProfessionById(profession),
        //         qualities: getQualities(qualities)
        //     })
        //     .then((data) => history.push(`/users/${data._id}`));
        // console.log({
        //     ...data,
        //     profession: getProfessionById(profession),
        //     qualities: getQualities(qualities)
        // });
    };

    const validatorConfig = {
        email: {
            isRequired: {
                message: "Электронная почта обязательна для заполнения"
            },
            isEmail: {
                message: "Email введен некорректно"
            }
        },
        name: {
            isRequired: {
                message: "Введите ваше имя"
            }
        }
    };
    useEffect(() => {
        validate();
    }, [data]);
    const handleChange = (target) => {
        setData((prevState) => ({
            ...prevState,
            [target.name]: target.value
        }));
    };
    const validate = () => {
        const errors = validator(data, validatorConfig);
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };
    const isValid = Object.keys(errors).length === 0;
    return (
        <div className="container mt-5">
            <BackHistoryButton />
            <div className="row">
                <div className="col-md-6 offset-md-3 shadow p-4">
                    {!professionsLoading && !qualitiesLoading && currentUser.qualities ? (
                        <form onSubmit={handleSubmit}>
                            <TextField
                                label="Имя"
                                name="name"
                                value={data.name}
                                onChange={handleChange}
                                error={errors.name}
                            />
                            <TextField
                                label="Электронная почта"
                                name="email"
                                value={data.email}
                                onChange={handleChange}
                                error={errors.email}
                            />
                            <SelectField
                                label="Выбери свою профессию"
                                defaultOption="Choose..."
                                options={professions}
                                name="profession"
                                onChange={handleChange}
                                value={data.profession}
                                error={errors.profession}
                            />
                            <RadioField
                                options={[
                                    { name: "Male", value: "male" },
                                    { name: "Female", value: "female" },
                                    { name: "Other", value: "other" }
                                ]}
                                value={data.sex}
                                name="sex"
                                onChange={handleChange}
                                label="Выберите ваш пол"
                            />
                            <MultiSelectField
                                defaultValue={transformData(currentUser.qualities)}
                                options={qualities}
                                onChange={handleChange}
                                name="qualities"
                                label="Выберите ваши качества"
                            />
                            <button
                                type="submit"
                                disabled={!isValid}
                                className="btn btn-primary w-100 mx-auto"
                            >
                                Обновить
                            </button>
                        </form>
                    ) : (
                        "Loading..."
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditUserPage;
