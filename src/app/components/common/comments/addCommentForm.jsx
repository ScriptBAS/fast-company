import React, { useState } from "react";
import TextAreaField from "../form/textAreaField";
import { validator } from "../../../utils/validator";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { getCurrentUserId } from "../../../store/users";
import { useParams } from "react-router-dom";

const AddCommentForm = ({ onSubmit }) => {
    const { userId } = useParams();
    const [data, setData] = useState({});
    const [errors, setErrors] = useState({});
    const currentUserid = useSelector(getCurrentUserId());
    const handleChange = (target) => {
        setData((prevState) => ({
            ...prevState,
            [target.name]: target.value
        }));
    };
    const validatorConfig = {
        content: {
            isRequired: {
                message: "Сообщение не может быть пустым"
            }
        }
    };

    const validate = () => {
        const errors = validator(data, validatorConfig);
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };
    const clearForm = () => {
        setData({});
        setErrors({});
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        const isValid = validate();
        if (!isValid) return;
        onSubmit(data, userId, currentUserid);
        clearForm();
    };
    return (
        <div>
            <h2>New comment</h2>
            <form onSubmit={handleSubmit}>
                <TextAreaField
                    value={data.content || ""}
                    onChange={handleChange}
                    name="content"
                    label="Сообщение"
                    error={errors.content}
                />
                <div className="d-flex justify-content-end">
                    <button className="btn btn-primary">Опубликовать</button>
                </div>
            </form>
        </div>
    );
};
AddCommentForm.propTypes = {
    onSubmit: PropTypes.func,
    userId: PropTypes.string,
    currentUserId: PropTypes.string
};

export default AddCommentForm;
