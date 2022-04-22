import { ProductionEnvironment } from "./production";
import { DevelopmentEnvironment } from "./development";

/**
 * Environment is a singleton that defines the constants available within the
 * current environment. It uses DevelopmentEnvironment as the base and
 * overwrites the values when running in production
 *
 * A singleton is used to allow us to run checks on the setup while keeping
 * the interface to the variables clean. Once defined the environment is
 * frozen to avoid any values being changed at runtime.
 */
class Environment extends DevelopmentEnvironment {
  // Index signature to allow index access of properties
  // see https://basarat.gitbook.io/typescript/type-system/index-signatures#declaring-an-index-signature
  [index: string]: any;
  // Current instance
  private static instance: Environment;

  /**
   * The constructor cannot be called directly, getInstance should be used
   * instead. This constuctor allows checks to be done for safety.
   */
  private constructor() {
    super();
    const baseVariables = Object.getOwnPropertyNames(this);
    const productionEnvironment = new ProductionEnvironment();
    const productionVariables = Object.getOwnPropertyNames(productionEnvironment);

    // Check if we have any variables defined in development, but not in
    // production
    for (const baseVariable of baseVariables) {
      if (!productionVariables.includes(baseVariable)) {
        console.error(`Variable "${baseVariable} not defined in production environment`);
      }
    }
    // If we're running in production, overwrite values from the production
    // environment
    if (process.env.NODE_ENV === "production") {
      for (const productionVariable of productionVariables) {
        this[productionVariable] = productionEnvironment[productionVariable];
      }
    }
  }

  /**
   * Get the current environment if it exists, else create and return it.
   *
   * We also freeze the instance here to avoid any accidental changes to the
   * values
   */
  public static getInstance(): Environment {
    if (!Environment.instance) {
      Environment.instance = new Environment();
    }

    return Object.freeze(Environment.instance);
  }
}

// Export current environment as constants
export default Environment.getInstance();
