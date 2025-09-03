import React from "react";
import { type CustomerAddress } from "../../../types/CustomerAddress";

type AddressProps = {
  addresses?: CustomerAddress[];
};

const Address: React.FC<AddressProps> = ({ addresses }) => {
    return (
        <div>
            <h5>{addresses?.length ?? 0}</h5>
        </div>
    );
};

export default Address;