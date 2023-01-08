import PropTypes from "prop-types";
import React from "react";
import { useQuality } from "../../../hooks/useQuality";

const Quality = ({ id }) => {
    const { getQuality } = useQuality();
    const { color, name } = getQuality(id);
    return <span className={"badge m-1 bg-" + color}>{name}</span>;
};
Quality.propTypes = {
    id: PropTypes.string.isRequired
};

export default Quality;
