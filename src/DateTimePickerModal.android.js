import React, { useEffect, useRef, useState, memo } from "react";
import PropTypes from "prop-types";
import DateTimePicker from "@react-native-community/datetimepicker";

// Memo workaround for https://github.com/react-native-community/datetimepicker/issues/54
const areEqual = (prevProps, nextProps) => {
  return (
    prevProps.isVisible === nextProps.isVisible &&
    prevProps.date.getTime() === nextProps.date.getTime()
  );
};

const DateTimePickerModal = memo(
  ({ date, mode, isVisible, onCancel, onConfirm, onHide, ...otherProps }) => {
    const currentDateRef = useRef(date);
    const [currentMode, setCurrentMode] = useState(null);
    const [datePicker, setDate] = useState(date);

    useEffect(() => {
      if (isVisible && currentMode === null) {
        setCurrentMode(mode === "time" ? "time" : "date");
      } else if (!isVisible) {
        setCurrentMode(null);
      } 

      if(mode === "time"){
        setDate(new Date());
      }
    }, [isVisible, currentMode, mode]);

    if (!isVisible || !currentMode) return null;

    const handleChange = (event, date) => {
      if (event.type === "dismissed") {
        onCancel();
        onHide(false);
        return;
      }

      let nextDate = date;
      if (mode === "datetime") {
        if (currentMode === "date") {
          setCurrentMode("time");
          currentDateRef.current = new Date(date);
          let year = currentDateRef.current.getFullYear();
          let month = currentDateRef.current.getMonth();
          let day = currentDateRef.current.getDate();
          let hours = new Date().getHours();
          let minutes = new Date().getMinutes();
          nextDate = new Date(year, month, day, hours, minutes);
          setDate(nextDate);
          
          return;
        } else if (currentMode === "time") {
          currentDateRef.current = new Date(date);
          let year = currentDateRef.current.getFullYear();
          let month = currentDateRef.current.getMonth();
          let day = currentDateRef.current.getDate();
          let hours = date.getHours();
          let minutes = date.getMinutes();
          nextDate = new Date(year, month, day, hours, minutes);
          setDate(nextDate);
        }
      }

      onConfirm(nextDate);
      onHide(true, nextDate);
    };

    
    return (
      <DateTimePicker
        {...otherProps}
        mode={currentMode}
        value={datePicker}
        onChange={handleChange}
      />
    );
  },
  areEqual
);

DateTimePickerModal.propTypes = {
  date: PropTypes.instanceOf(Date),
  isVisible: PropTypes.bool,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onHide: PropTypes.func,
  maximumDate: PropTypes.instanceOf(Date),
  minimumDate: PropTypes.instanceOf(Date),
};

DateTimePickerModal.defaultProps = {
  date: new Date(),
  isVisible: false,
  onHide: () => { },
};

export { DateTimePickerModal };
