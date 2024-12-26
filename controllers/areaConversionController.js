export const convertArea = async (req, res) => {
  const { fromUnit, toUnit } = req.params; // Extract units from route parameters
  const { value } = req.body; // Extract value from request body

  // Validate input
  if (!fromUnit || !toUnit || !value) {
    return res.status(400).json({
      success: false,
      message: "Missing required parameters: fromUnit, toUnit, or value",
    });
  }
  
    // Conversion Factors
    const conversionFactors = {
      sqft: {
        sqm: 0.092903,
        gaj: 0.111111,
        acre: 2.29568e-5,
        bigha: 0.000014,
        katha: 0.0000186,
        guntha: 0.0000229568,
        cent: 0.00229568,
      },
      gaj: {
        sqft: 9,
        sqm: 0.836127,
        acre: 0.00020661157,
        bigha: 0.000166528,
        katha: 0.000186,
        guntha: 0.00020661157,
        cent: 0.002066,
      },
      sqm: {
        sqft: 10.7639,
        gaj: 1.19599,
        acre: 0.000247105,
        bigha: 0.0002,
        katha: 0.00025,
        guntha: 0.000247105,
        cent: 0.0247105,
      },
      acre: {
        sqft: 43560,
        gaj: 4840,
        sqm: 4046.86,
        bigha: 4.84,
        katha: 20,
        guntha: 40,
        cent: 100,
      },
      bigha: {
        sqft: 65340,
        gaj: 605,
        sqm: 5448,
        acre: 0.206612,
        katha: 20.16,
        guntha: 16.133,
        cent: 20.6612,
      },
      katha: {
        sqft: 3276,
        gaj: 364,
        sqm: 304.8,
        acre: 0.05,
        bigha: 0.05,
        guntha: 0.5,
        cent: 2.5,
      },
      guntha: {
        sqft: 1089,
        gaj: 121,
        sqm: 101.17,
        acre: 0.025,
        bigha: 0.031,
        katha: 2,
        cent: 2.5,
      },
      cent: {
        sqft: 435.6,
        gaj: 48.4,
        sqm: 40.4686,
        acre: 0.01,
        bigha: 0.0484,
        katha: 0.4,
        guntha: 0.4,
      },
    };
  
    // Perform conversion
    const conversionFactor = conversionFactors[fromUnit]?.[toUnit];
  
    if (!conversionFactor) {
      return res.status(400).json({
        success: false,
        message: `Conversion from ${fromUnit} to ${toUnit} is not supported`,
      });
    }
  
    const convertedValue = value * conversionFactor;
  
    return res.status(200).json({
      success: true,
      data: {
        fromUnit,
        toUnit,
        originalValue: value,
        convertedValue,
      },
    });
  };
  