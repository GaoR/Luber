import React from 'react';

const convertSeconds = time => `${Math.floor(time / 60)} min`;

const Lyft = (props) => {
  const { uber } = props;
  return (
    uber.length > 0
      ? (
        <div id="uber">
          <img src="/uberlogo" alt="Uber Logo" height="120" width="180" />
          {uber.map(ride => (
            <div>
              {`${ride.localized_display_name} | ${ride.estimate} | ${ride.distance} | ${convertSeconds(ride.duration)}`}
            </div>
          ))}
        </div>)
      : <div />
  );
};

export default Lyft;
