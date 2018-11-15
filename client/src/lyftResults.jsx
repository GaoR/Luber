import React from 'react';

const convertSeconds = time => `${Math.floor(time / 60)} min`;

const Lyft = (props) => {
  const { lyft } = props;
  return (
    lyft.length > 0
      ? (
        <div id="lyft">
          <img src="/lyftlogo" alt="Lyft Logo" height="120" width="180" />
          {lyft.map(ride => (
            <div>
              {`${ride.display_name} | $${(ride.estimated_cost_cents_min / 100)}-${(ride.estimated_cost_cents_max / 100)} | ${convertSeconds(ride.estimated_duration_seconds)}`}
            </div>
          ))}
        </div>)
      : <div />
  );
};

export default Lyft;
