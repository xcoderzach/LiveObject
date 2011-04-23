var ClassTest = TestCase("ClassTest")

var Classy = function (self) {
  self.anotherPrivateVariable = 100
  this.anotherPublicVariable = 100
}

Classy.prototype.publicMethod = function(self) {
  return self.privateMethod()
}

Classy.prototype._privateMethod = function(self) {
  return self.privateVariable + self.publicVariable
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


ClassTest.prototype.testMonkeyRun = function() {

  classyInstance.monkeyRun(function(self) {
    assertEquals("Monkeys needs private methods!", self.privateMethod(), 20)
    assertEquals("Monkeys needs private variables!", self.privateVariable, 10)

    assertEquals("Monkeys needs public methods!", self.publicMethod(), 20)
    assertEquals("Monkeys needs public variables!", self.publicVariable, 10)
  })
} 
