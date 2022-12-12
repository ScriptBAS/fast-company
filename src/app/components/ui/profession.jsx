import React, { UseProfessions } from "../../hooks/useProfession";
import PropTypes from "prop-types";

const Profession = ({ id }) => {
    const { isLoading, getProfession } = UseProfessions();
    const prof = getProfession(id);
    if (!isLoading) {
        return <p>{prof.name}</p>;
    }
    return "Loading...";
};

export default Profession;

Profession.propTypes = {
    id: PropTypes.string
};
