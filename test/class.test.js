var ClassTest = TestCase("ClassTest")

var Classy = function (self) {
  self.anotherPrivateVariable = 100
  this.anotherPublicVariable = 100
}

Classy.prototype.publicMethod = function(self) {
  return self.privateMethod()
}

Classy.prototype._privateMethod = function(self) {
  return self.privateVariable + this.publicVariable
}

Classy.prototype._privateVariable = 10
Classy.prototype.publicVariable = 10

var Classy = Constructor(Classy)

var classyInstance = new Classy() 

ClassTest.prototype.testPropertyScopes = function() {
  assertEquals("publicMethod not returning correctly", classyInstance.publicMethod(), 20)

  assertEquals("privateMethod not private", typeof classyInstance.privateMethod, "undefined")
  assertEquals("privateMethod not private", typeof classyInstance._privateMethod, "undefined")

  assertEquals("privateVariable not private", typeof classyInstance.privateVariable, "undefined")
  assertEquals("privateVariable not private", typeof classyInstance._privateVariable, "undefined")

  assertEquals("runtime privateVariable not private", typeof classyInstance.anotherPrivateVariable, "undefined")
  assertEquals("runtime publicVariable not public", classyInstance.anotherPublicVariable, 100)

  assertEquals("privateMethod not public", typeof classyInstance._privateMethod, "undefined")
}

function monkeyTest(self) {
    assertEquals("Monkeys needs private methods!", self.privateMethod(), 20)
    assertEquals("Monkeys needs private variables!", self.privateVariable, 10)

    assertEquals("Monkeys needs public methods!", this.publicMethod(), 20)
    assertEquals("Monkeys needs public variables!", this.publicVariable, 10)
  }

ClassTest.prototype.testMonkeyRun = function() {
  classyInstance.monkeyRun(monkeyTest)
} 

ClassTest.prototype.testInstanceMonkeyPatch = function() {
  var anotherInstance = new Classy()
  classyInstance.monkeyPatch("w00t", monkeyTest)

  classyInstance.w00t()

  assertEquals("Monkey patch leaking to other instances!!!!!", typeof anotherInstance.w00t, "undefined")
}  

ClassTest.prototype.testClassMonkeyPatch = function() {
  var anEarlyInstance = new Classy()
  Classy.monkeyPatch("w00t", monkeyTest)

  classyInstance.w00t()

  var aLateInstance = new Classy()

  aLateInstance.w00t()
  anEarlyInstance.w00t()
} 

ClassTest.prototype.testOverriding = function() {
  var NewClassy = function(self) {

  }
  NewClassy.prototype.publicVariable = 10
  NewClassy.prototype.mutateVariable = function(self) {
    this.publicVariable = 20
  }
  NewClassy = Constructor(NewClassy)

  var class1 = NewClassy()
  var class2 = NewClassy()

  class1.mutateVariable()

  assertEquals("Not mutated!", class1.publicVariable, 20)
  assertEquals("Mutated when it should not have been!", class1.publicVariable, 10)
}  
 
