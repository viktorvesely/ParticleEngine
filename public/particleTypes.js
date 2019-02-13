const ParticleTypes = [
  {
    name: "blue",
    color: "#87fffd",
    radius: 5,
    frictionModificator: 1, 
    forceRadius: 200,
    maxForce: 0.4,
    behaviour: [
      {
        name: "yellow",
        forceModificator: -1
      },
      {
        name: "blue",
        forceModificator: -1.03
      },
      {
        name: "white",
        forceModificator: 1.1
      },
      {
        name: "repelent",
        forceModificator: 1
      },
      {
        name: "purple",
        forceModificator: 1
      }
    ]
  },
  {
    name: "yellow",
    color: "#fbff1e",
    radius: 6,
    frictionModificator: 1, 
    forceRadius: 100,
    maxForce: 0.7,
    behaviour: [
      {
        name: "repelent",
        forceModificator: 1
      },
      {
        name: "blue",
        forceModificator: 1 
      },
      {
        name: "white",
        forceModificator: -1
      }
    ]
  },
  {
    name: "repelent",
    color: "#00ff55",
    radius: 4,
    frictionModificator: 0.5,
    forceRadius: 800,
    maxForce: 0.2,
    behaviour: [
      {
        name: "all",
        forceModificator: -1
      }
    ]
  },
  {
    name: "white",
    color: "white",
    radius: 6,
    frictionModificator: 1, 
    forceRadius: 180,
    maxForce: 0.9,
    behaviour: [
      {
        name: "yellow",
        forceModificator: -1.1
      }
    ]
  },
  {
    name: "purple",
    color: "purple",
    radius: 6,
    frictionModificator: 1, 
    forceRadius: 350,
    maxForce: 0.5,
    behaviour: [
      {
        name: "white",
        forceModificator: 1.1
      },
      {
        name: "yellow",
        forceModificator: 1.1
      },
      {
        name: "blue",
        forceModificator: -0.1
      },
      {
        name: "repelent",
        forceModificator: 1
      },
      {
        name: "orange",
        forceModificator: -1.3
      }
    ]
  },
  {
    name: "orange",
    color: "#ffaa00",
    radius: 6,
    frictionModificator: 1, 
    forceRadius: 300,
    maxForce: 0.6,
    behaviour: [
      {
        name: "yellow",
        forceModificator: 1
      },
      {
        name: "orange",
        forceModificator: -0.4
      },
      {
        name: "purple",
        forceModificator: -1
      }
    ]
  }
]


function shuffleBehaviour() {
  ParticleTypes.forEach(type => {
    type.behaviour = [];
    ParticleTypes.forEach(target=> {
      if (Math.floor(Math.random() * 3) % 4 === 0) {
        return;
      }
      type.behaviour.push({
        name: target.name,
        forceModificator: Math.random() * 4 - 2
      })
    })
  });
}