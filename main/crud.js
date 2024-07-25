const { PrismaClient } = require("@prisma/client");


const prisma = new PrismaClient()
async function Create(data) {
  var i = await prisma.fileinfo.create({
    data: {
      filepath: data,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  })

  if (i.id) {
    return i.id
  }
  return "Failed to create file"

}

async function read() {
  var d = await prisma.fileinfo.findMany()
  return d
}

function update(id, data) { }

function remove(id) { }

module.exports = {
  Create,
  read,

};
